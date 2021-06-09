import ControllerResponseValidatoor from "../../../src/utils/controllers/controller-response.validator"

describe("ControllerResponseValidatoor | Validate", () => {
  test("Response is null throws error", () => {
    const controllerResponse = null
    // Given
    expect(controllerResponse).toBeNull()
    // When
    let validateErr: Error = undefined
    try {
      ControllerResponseValidatoor.validate(controllerResponse)
    } catch (err) {
      validateErr = err
    }
    // Then
    expect(validateErr).toBeDefined()
    expect(validateErr.message).toBeTruthy()
  })

  test("Response is undefined throws error", () => {
    const controllerResponse = undefined
    // Given
    expect(controllerResponse).not.toBeDefined()
    // When
    let validateErr: Error = undefined
    try {
      ControllerResponseValidatoor.validate(controllerResponse)
    } catch (err) {
      validateErr = err
    }
    // Then
    expect(validateErr).toBeDefined()
    expect(validateErr.message).toBeTruthy()
  })

  test("Without status throws err", () => {
    const controllerResponse = { body: "Hello" }
    // Given
    expect(Object.keys(controllerResponse)).not.toContain("status")
    // When
    let validateErr: Error = undefined
    try {
      // @ts-ignore
      ControllerResponseValidatoor.validate(controllerResponse)
    } catch (err) {
      validateErr = err
    }
    // Then
    expect(validateErr).toBeDefined()
    expect(validateErr.message).toBeTruthy()
  })

  test("With status 201 have body throws error", () => {
    const controllerResponse = { status: 201, body: "Hello" }
    // Given
    expect(Object.keys(controllerResponse)).toContain("body")
    // When
    let validateErr: Error = undefined
    try {
      // @ts-ignore
      ControllerResponseValidatoor.validate(controllerResponse)
    } catch (err) {
      validateErr = err
    }
    // Then
    expect(validateErr).toBeDefined()
    expect(validateErr.message).toBeTruthy()
  })

  test("With status 204 have body throws error", () => {
    const controllerResponse = { status: 204, body: "Hello" }
    // Given
    expect(Object.keys(controllerResponse)).toContain("body")
    // When
    let validateErr: Error = undefined
    try {
      // @ts-ignore
      ControllerResponseValidatoor.validate(controllerResponse)
    } catch (err) {
      validateErr = err
    }
    // Then
    expect(validateErr).toBeDefined()
    expect(validateErr.message).toBeTruthy()
  })

  test("With status 200 have body throws no error", () => {
    const controllerResponse = { status: 200, body: "Hello" }
    // Given
    expect(Object.keys(controllerResponse)).toContain("body")
    // When
    let validateErr: Error = undefined
    try {
      // @ts-ignore
      ControllerResponseValidatoor.validate(controllerResponse)
    } catch (err) {
      validateErr = err
    }
    // Then
    expect(validateErr).not.toBeDefined()
  })
})
