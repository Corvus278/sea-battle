/**
 * Пример теста для демонстрации настройки Jest
 */

import { describe } from 'node:test';

describe('Example Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle async operations', async () => {
    const promise = Promise.resolve('test data');
    await expect(promise).resolves.toBe('test data');
  });
});
