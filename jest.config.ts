import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['<rootDir>/test/', 'node_modules', 'dist', '.swagger.ts$'],
  testPathIgnorePatterns: ['dist', 'node_modules'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageReporters: ['lcov', 'text'],
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },
  rootDir: './',
  bail: true,
  maxWorkers: 1,
  moduleNameMapper: {
    '^@/memo/(.*)$': '<rootDir>/src/modules/memo/$1',
    '^@/member/(.*)$': '<rootDir>/src/modules/member/$1',
    '^@/auth/(.*)$': '<rootDir>/src/modules/auth/$1',
    '^@/blog/(.*)$': '<rootDir>/src/modules/blog/$1',
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/common/(.*)$': '<rootDir>/src/common/$1',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/infra/(.*)$': '<rootDir>/src/infra/$1',
  },
};

export default config;
