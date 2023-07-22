import { config } from 'dotenv';
import { join } from 'node:path';

config({ path: join(__dirname, '../.env.test') });

export default {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/services/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text-summary', 'lcov'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
  },
};
