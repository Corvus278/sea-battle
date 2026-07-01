export default function OfflinePage() {
  return (
    <main className="flex size-full min-h-dvh flex-col items-center justify-center gap-3 bg-stone-900 p-6 text-center text-stone-100">
      <h1 className="text-2xl font-bold">Нет сети</h1>
      <p className="max-w-xs text-stone-400">
        Не удалось загрузить страницу. Проверьте подключение — после первого запуска игра работает и
        без интернета.
      </p>
    </main>
  );
}
