import "jest-extended"

import ServiceValidator from "../../../../src/domain/validators/service.validator"

describe.only("ServiceValidator | IsValidService", () => {
  test("Null service returns false", () => {
    const service = null
    // Given
    expect(service).toBeNull()
    // When
    const isValid = ServiceValidator.isValidService(service)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Undefined service returns false", () => {
    const service = undefined
    // Given
    expect(service).not.toBeDefined()
    // When
    const isValid = ServiceValidator.isValidService(service)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Not object service returns false", () => {
    const service = 123
    // Given
    expect(service).not.toBeObject()
    // When
    const isValid = ServiceValidator.isValidService(service)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Has no execute method returns false", () => {
    class MockService {}
    const mockService = new MockService()
    const mockPrototype = Object.getPrototypeOf(mockService)
    const mockPropertyNames = Object.getOwnPropertyNames(mockPrototype)
    // Given
    expect(mockPropertyNames).not.toContain("execute")
    // When
    const isValid = ServiceValidator.isValidService(mockService)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Has execute method returns true", () => {
    class MockService {
      execute() {}
    }
    const mockService = new MockService()
    const mockPrototype = Object.getPrototypeOf(mockService)
    const mockPropertyNames = Object.getOwnPropertyNames(mockPrototype)
    // Given
    expect(mockPropertyNames).toContain("execute")
    // When
    const isValid = ServiceValidator.isValidService(mockService)
    // Then
    expect(isValid).toBeTrue()
  })
})
