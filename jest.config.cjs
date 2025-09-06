/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/server'],
  testMatch: ['<rootDir>/server/**/*.test.ts'],
  maxWorkers: 1, // Run tests sequentially to avoid database locking
  testTimeout: 10000, // Increase timeout for database operations
};
