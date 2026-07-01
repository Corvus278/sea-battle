#!/usr/bin/env bash
# PostToolUse-хук: после правки файлов гоняет eslint и tsc (--noEmit)
# для JS/TS
#
# Коды возврата:
#   0 — всё чисто или только warnings / tsc-ошибки в чужих файлах.
#   1 — сам линтер/компилятор не запустился (нет бинарника, unparseable output).
#   2 — есть errors в ПРАВЛЕННОМ файле (блокирует и возвращает вывод агенту).

set -uo pipefail

if ! command -v jq >/dev/null 2>&1; then
  echo "[lint-hook] jq не найден в PATH. Установите: brew install jq (macOS) / apt install jq (Linux)." >&2
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TSC_CACHE="node_modules/.cache/claude-tsc.tsbuildinfo"
TSC_TIMEOUT=90
ESLINT_TIMEOUT=60

# macOS-совместимый таймаут через perl (timeout(1) нет в BSD по умолчанию).
# Печатает stdout+stderr команды; rc=124 при таймауте.
run_with_timeout() {
  local timeout="$1"; shift
  perl -e '
    use strict; use warnings;
    my $timeout = shift; my @cmd = @ARGV;
    my $pid = fork();
    if (!defined $pid) { die "fork failed"; }
    if ($pid == 0) { exec @cmd; die "exec failed"; }
    local $SIG{ALRM} = sub { kill "TERM", $pid; sleep 1; kill "KILL", $pid; exit 124; };
    alarm $timeout;
    waitpid($pid, 0);
    exit($? >> 8);
  ' "$timeout" "$@" 2>&1
}

input="$(cat)"
file_path="$(jq -r '.tool_input.file_path // empty' <<<"$input" 2>/dev/null)"
[ -z "$file_path" ] && exit 0

case "$file_path" in
  /*) abs="$file_path" ;;
  *)  abs="$REPO_ROOT/$file_path" ;;
esac

case "$abs" in /*) ;;
  *) exit 0 ;;
esac

[ -f "$abs" ] || exit 0

ext="${abs##*.}"
rel="${abs#"$REPO_ROOT"/}"

cd "$REPO_ROOT"

had_error=0

run_eslint() {
  local bin="node_modules/.bin/eslint"

  if [ ! -x "$bin" ]; then
    echo "[eslint-hook] eslint binary not found at $bin, skipping" >&2
    return 1
  fi

  local raw rc
  raw="$(run_with_timeout "$ESLINT_TIMEOUT" "$bin" --format json "$rel")"
  rc=$?

  if [ "$rc" -eq 124 ]; then
    echo "[eslint] timed out after ${ESLINT_TIMEOUT}s — линт не проверен" >&2
    return 0
  fi

  if [ -z "$raw" ]; then
    echo "[eslint-hook] empty output for $rel (linter likely crashed)" >&2
    return 1
  fi

  local errors warnings
  errors="$(jq -r '[.[].messages[]? | select(.severity==2)] | length' <<<"$raw" 2>/dev/null)"
  warnings="$(jq -r '[.[].messages[]? | select(.severity==1)] | length' <<<"$raw" 2>/dev/null)"

  if [ -z "$errors" ] || [ -z "$warnings" ]; then
    echo "[eslint-hook] unparseable JSON output for $rel:" >&2
    echo "$raw" | head -c 500 >&2
    return 1
  fi

  if [ "$errors" -gt 0 ] || [ "$warnings" -gt 0 ]; then
    echo "[eslint] $errors error(s), $warnings warning(s) in $rel:" >&2
    jq -r --arg file "$rel" '
      .[].messages[]? |
      "\($file):\(.line):\(.column) \(if .severity==2 then "error" else "warn" end) \(.message) [\(.ruleId // "?")]"
    ' <<<"$raw" >&2
  fi

  [ "$errors" -gt 0 ] && had_error=1
  return 0
}

# tsc --noEmit -p tsconfig.json c инкрементальным кэшем.
# Блокируем только ошибки в правленом файле; ошибки в других файлах — предупреждения,
# чтобы агент не застрял на "долгах" существующего кода.
run_tsc() {
  local bin="node_modules/.bin/tsc"

  if [ ! -x "$bin" ]; then
    echo "[tsc-hook] tsc binary not found at $bin, skipping" >&2
    return 1
  fi

  mkdir -p "$(dirname "$TSC_CACHE")"

  local raw rc
  raw="$(run_with_timeout "$TSC_TIMEOUT" \
    "$bin" --noEmit -p tsconfig.json \
           --incremental --tsBuildInfoFile "$TSC_CACHE" \
           --pretty false)"
  rc=$?

  if [ "$rc" -eq 124 ]; then
    echo "[tsc] timed out after ${TSC_TIMEOUT}s — типы не проверены" >&2
    return 0
  fi

  # tsc rc=0 — чисто; rc=1/2 — есть ошибки (в stdout); остальные rc — запуск не удался
  if [ "$rc" -ne 0 ] && [ "$rc" -ne 1 ] && [ "$rc" -ne 2 ]; then
    echo "[tsc-hook] tsc crashed (exit $rc):" >&2
    echo "$raw" | head -c 500 >&2
    return 1
  fi

  [ -z "$raw" ] && return 0

  # Строки вида: path/to/file.ts(line,col): error TSxxxx: message
  local errors_here errors_other
  errors_here="$(awk -v f="$rel" -F'[()]' 'index($1, f)==1 && /: error TS[0-9]+:/' <<<"$raw")"
  errors_other="$(awk -v f="$rel" -F'[()]' 'index($1, f)!=1 && /: error TS[0-9]+:/' <<<"$raw")"

  if [ -n "$errors_here" ]; then
    local n
    n=$(wc -l <<<"$errors_here" | tr -d ' ')
    echo "[tsc] $n error(s) in $rel:" >&2
    echo "$errors_here" >&2
    had_error=1
  fi

  if [ -n "$errors_other" ]; then
    local n
    n=$(wc -l <<<"$errors_other" | tr -d ' ')
    echo "[tsc] $n error(s) in ДРУГИХ файлах (не блокирует правку в $rel):" >&2
    echo "$errors_other" | head -30 >&2
  fi

  return 0
}

case "$ext" in
  ts|tsx)
    run_eslint
    run_tsc
    ;;
  js|jsx|mjs|cjs)
    run_eslint
    ;;
  *)
    exit 0
    ;;
esac

[ "$had_error" -eq 1 ] && exit 2
exit 0
