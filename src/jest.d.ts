// Jest 전역 타입 선언
/* eslint-disable no-var */
declare const jest: {
  mock: (moduleName: string, factory?: () => unknown) => void;
  fn: <T extends (...args: unknown[]) => unknown>(
    implementation?: T,
  ) => jest.Mock<T>;
  Mock: new <T extends (...args: unknown[]) => unknown>() => jest.Mock<T>;
  [key: string]: unknown;
};

declare var describe: (name: string, fn: () => void) => void;
declare var it: (name: string, fn: () => void | Promise<void>) => void;
declare var test: (name: string, fn: () => void | Promise<void>) => void;
declare var expect: <T = unknown>(
  actual: T,
) => {
  toBe: (expected: T) => void;
  toEqual: (expected: T) => void;
  toBeInTheDocument: () => void;
  toHaveAttribute: (attr: string, value?: string) => void;
  toHaveClass: (className: string) => void;
  not: {
    toBeInTheDocument: () => void;
  };
};
declare var beforeEach: (fn: () => void | Promise<void>) => void;
declare var afterEach: (fn: () => void | Promise<void>) => void;
declare var beforeAll: (fn: () => void | Promise<void>) => void;
declare var afterAll: (fn: () => void | Promise<void>) => void;
