const hasDatabase = Boolean(process.env.DATABASE_URL);

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/server'],
  testMatch: ['<rootDir>/server/**/*.test.ts'],
  testPathIgnorePatterns: hasDatabase
    ? []
    : [
        '<rootDir>/server/tests/db-service.integration.test.ts',
        '<rootDir>/server/tests/delete-card.test.ts',
        '<rootDir>/server/tests/create-cards.test.ts',
      ],
  maxWorkers: 1, // Run tests sequentially to avoid database locking
  testTimeout: 10000, // Increase timeout for database operations
};
