import type { Config } from 'jest';
import defaultConfig from './jest.config';

const config: Config = {
  ...defaultConfig,
  testMatch: ['**/test/unit/**/*.spec.ts'],
};

export default config;
