module.exports = {
  coverageProvider: "v8",
  globalSetup: "<rootDir>/__tests__/global-setup.ts",
  globalTeardown: "<rootDir>/__tests__/global-teardown.ts",
  testEnvironment: "node",
  testMatch: ["<rootDir>/__tests__/**/*.test.ts"]
}
