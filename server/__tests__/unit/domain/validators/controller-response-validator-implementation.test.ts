import "jest-extended"

import { ControllerResponse } from "../../../../src/domain/types/router.types"

import ControllerResponseValidator from "../../../../src/domain/validators/controller-response-validator.interface"

import ControllerResponseValidatorImplementation from "../../../../src/domain/validators/implementations/controller-response.validator"

import {
  MockControllerArgsAsResponse,
  MockControllerStatusPayload
} from "../../../utils/mocks/domain/controllers/controller.mock"
import { expectsToHaveError } from "../../../utils/functions/expects.functions"
import { getSyncError } from "../../../utils/functions/error.functions"

const getValidatorError = (
  validator: ControllerResponseValidator,
  response: ControllerResponse<any>
): null | Error => {
  const possibleErr = getSyncError(() => {
    validator.validate(response)
  })
  return possibleErr
}

let controllerResponseValidator: ControllerResponseValidator

beforeAll(() => {
  controllerResponseValidator = new ControllerResponseValidatorImplementation()
})

describe("ControllerResponseValidator | Validate | If controller response invalid throws errors", () => {
  test("Null", async () => {
    const controllerResponse = await new MockControllerArgsAsResponse(null).execute()
    // Given
    expect(controllerResponse).toBeNull()
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Undefined", async () => {
    const controllerResponse = await new MockControllerArgsAsResponse(undefined).execute()
    // Given
    expect(controllerResponse).toBeUndefined()
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Typeof not object", async () => {
    const controllerResponse = await new MockControllerArgsAsResponse(123).execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse).not.toBeObject()
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Null Status", async () => {
    const controllerResponse = await new MockControllerStatusPayload(null, "foo").execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBeNull()
    expect(controllerResponse.body).toBe("foo")
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Undefined Status", async () => {
    const controllerResponse = await new MockControllerStatusPayload(undefined, "foo").execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBeUndefined()
    expect(controllerResponse.body).toBe("foo")
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Typeof status not number", async () => {
    const controllerResponse = await new MockControllerStatusPayload("foo", "bar").execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBeTruthy()
    expect(controllerResponse.status).not.toBeNumber()
    expect(controllerResponse.body).toBe("bar")
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Status 200 no body", async () => {
    const controllerResponse = await new MockControllerStatusPayload(200).execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(200)
    expect(controllerResponse.body).toBeUndefined()
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Status 201 with body", async () => {
    const controllerResponse = await new MockControllerStatusPayload(201, "foo").execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(201)
    expect(controllerResponse.body).toBe("foo")
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Status 204 with body", async () => {
    const controllerResponse = await new MockControllerStatusPayload(204, "foo").execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(204)
    expect(controllerResponse.body).toBe("foo")
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Status 400 no body", async () => {
    const controllerResponse = await new MockControllerStatusPayload(400).execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(400)
    expect(controllerResponse.body).toBeFalsy()
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Status 400 and typeof body not string", async () => {
    const controllerResponse = await new MockControllerStatusPayload(400, 123).execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(400)
    expect(controllerResponse.body).toBeTruthy()
    expect(controllerResponse.body).not.toBeString()
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Status 401 no body", async () => {
    const controllerResponse = await new MockControllerStatusPayload(401).execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(401)
    expect(controllerResponse.body).toBeFalsy()
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Status 401 and typeof body not string", async () => {
    const controllerResponse = await new MockControllerStatusPayload(401, 123).execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(401)
    expect(controllerResponse.body).toBeTruthy()
    expect(controllerResponse.body).not.toBeString()
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Status 500 no body", async () => {
    const controllerResponse = await new MockControllerStatusPayload(500).execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(500)
    expect(controllerResponse.body).toBeFalsy()
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })

  test("Status 500 and typeof body not string", async () => {
    const controllerResponse = await new MockControllerStatusPayload(500, 123).execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(500)
    expect(controllerResponse.body).toBeTruthy()
    expect(controllerResponse.body).not.toBeString()
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expectsToHaveError(validatorErr)
  })
})

describe("ControllerResponseValidator | Validate | Valid controller response should throw no errors", () => {
  test("Status 200 with truthy body", async () => {
    const controllerResponse = await new MockControllerStatusPayload(200, "foo").execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(200)
    expect(controllerResponse.body).toBe("foo")
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expect(validatorErr).toBeFalsy()
  })

  test("Status 201 with no body", async () => {
    const controllerResponse = await new MockControllerStatusPayload(201).execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(201)
    expect(controllerResponse.body).toBeUndefined()
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expect(validatorErr).toBeFalsy()
  })

  test("Status 204 with no body", async () => {
    const controllerResponse = await new MockControllerStatusPayload(204).execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(204)
    expect(controllerResponse.body).toBeUndefined()
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expect(validatorErr).toBeFalsy()
  })

  test("Status 400 with string body", async () => {
    const controllerResponse = await new MockControllerStatusPayload(400, "foo").execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(400)
    expect(controllerResponse.body).toBe("foo")
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expect(validatorErr).toBeFalsy()
  })

  test("Status 401 with string body", async () => {
    const controllerResponse = await new MockControllerStatusPayload(401, "foo").execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(401)
    expect(controllerResponse.body).toBe("foo")
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expect(validatorErr).toBeFalsy()
  })

  test("Status 500 with string body", async () => {
    const controllerResponse = await new MockControllerStatusPayload(500, "foo").execute()
    // Given
    expect(controllerResponse).toBeTruthy()
    expect(controllerResponse.status).toBe(500)
    expect(controllerResponse.body).toBe("foo")
    // When
    const validatorErr = getValidatorError(controllerResponseValidator, controllerResponse)
    // Then
    expect(validatorErr).toBeFalsy()
  })
})
