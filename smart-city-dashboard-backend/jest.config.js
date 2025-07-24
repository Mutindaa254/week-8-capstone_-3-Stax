module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./setupTests.js'], // Path to your test setup file
  moduleFileExtensions: ['js', 'json', 'node'],
  // No need for moduleDirectories specific to supertest anymore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/test.js', // Still ignore the root test.js file
  ],
};
