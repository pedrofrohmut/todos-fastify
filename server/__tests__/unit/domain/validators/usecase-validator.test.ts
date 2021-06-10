import "jest-extended"

import UseCaseValidator from "../../../../src/domain/validators/usecase.validator"

describe("UseCaseValidator | IsValidUseCase", () => {
  test("Null useCase returns false", () => {
    const useCase = null
    // Given
    expect(useCase).toBeNull()
    // When
    const isValid = UseCaseValidator.isValidUseCase(useCase)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Undefined useCase returns false", () => {
    const useCase = undefined
    // Given
    expect(useCase).not.toBeDefined()
    // When
    const isValid = UseCaseValidator.isValidUseCase(useCase)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Not object useCase returns false", () => {
    const useCase = 123
    // Given
    expect(useCase).not.toBeObject()
    // When
    const isValid = UseCaseValidator.isValidUseCase(useCase)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Has no execute method returns false", () => {
    class MockUseCase {}
    const mockUseCase = new MockUseCase()
    const mockPrototype = Object.getPrototypeOf(mockUseCase)
    const mockPropertyNames = Object.getOwnPropertyNames(mockPrototype)
    // Given
    expect(mockPropertyNames).not.toContain("execute")
    // When
    const isValid = UseCaseValidator.isValidUseCase(mockUseCase)
    // Then
    expect(isValid).toBeFalse()
  })

  test("Has execute method returns true", () => {
    class MockUseCase {
      execute() {}
    }
    const mockUseCase = new MockUseCase()
    const mockPrototype = Object.getPrototypeOf(mockUseCase)
    const mockPropertyNames = Object.getOwnPropertyNames(mockPrototype)
    // Given
    expect(mockPropertyNames).toContain("execute")
    // When
    const isValid = UseCaseValidator.isValidUseCase(mockUseCase)
    // Then
    expect(isValid).toBeTrue()
  })
})
