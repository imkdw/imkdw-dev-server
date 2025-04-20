import type { Config } from 'jest';
import defaultConfig from './jest.config';

const config: Config = {
  ...defaultConfig,
  testMatch: ['**/test/intergration/**/*.spec.ts'],
  maxWorkers: 1,
};

export default config;
