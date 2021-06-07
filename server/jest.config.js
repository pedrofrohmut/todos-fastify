module.exports = {
  clearMocks: true,
  coverageProvider: "v8",
  globals: {
    SERVER_URL: "http://127.0.0.1:5000"
  },
  globalSetup: "<rootDir>/__tests__/global-setup.ts",
  globalTeardown: "<rootDir>/__tests__/global-teardown.ts",
  setupFilesAfterEnv: ["jest-extended", "<rootDir>/__tests__/setup-tests.js"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.[tj]s?(x)"]
}
