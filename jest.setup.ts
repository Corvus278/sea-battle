// Опционально: для добавления пользовательских матчеров jest-dom
// import '@testing-library/jest-dom'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
declare global {
  interface Window {
    matchMedia: jest.MockedFunction<typeof window.matchMedia>;
  }

  interface Global {
    IntersectionObserver: typeof IntersectionObserver;
  }
}

// Настройки для тестирования React компонентов
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // устаревший
    removeListener: jest.fn(), // устаревший
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Мокаем IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  observe(): null {
    return null;
  }

  disconnect(): null {
    return null;
  }

  unobserve(): null {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

// Подавляем предупреждения console.error для чистого вывода тестов
const originalError = console.error;
beforeAll(() => {
  // eslint-disable-next-line no-console
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  // eslint-disable-next-line no-console
  console.error = originalError;
});
