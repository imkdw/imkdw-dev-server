import type { Config } from 'jest';
import defaultConfig from './jest.config';

const config: Config = {
  ...defaultConfig,
  testMatch: ['**/test/intergration/**/*.spec.ts'],
};

export default config;
