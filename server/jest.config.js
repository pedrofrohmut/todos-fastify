// eslint-disable-next-line
module.exports = {
  clearMocks: true,
  coverageProvider: "v8",
  globalSetup: "<rootDir>/__tests__/global-setup.ts",
  globalTeardown: "<rootDir>/__tests__/global-teardown.ts",
  testEnvironment: "node"
}
