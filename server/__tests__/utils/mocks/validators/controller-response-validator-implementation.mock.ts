import { ControllerResponse } from "../../../../src/domain/types/router.types"

import ControllerResponseValidator from "../../../../src/domain/validators/controller-response-validator.interface"

import MissingControllerResponseError from "../../../../src/domain/errors/controllers/missing-controller-response.error"
import InvalidResponseStatusError from "../../../../src/domain/errors/controllers/invalid-response-status.error"
import InvalidResponseBodyError from "../../../../src/domain/errors/controllers/invalid-response-body.error"

export class MockControllerResponseValidatorImplementation implements ControllerResponseValidator {
  public validate(response?: ControllerResponse): void {
    if (response === null || response === undefined) {
      throw new MissingControllerResponseError(
        "[MockControllerResponseValidatorImplementation] validate"
      )
    }
    if (response.status === undefined || (response.status && typeof response.status !== "number")) {
      throw new InvalidResponseStatusError(
        "[MockControllerResponseValidatorImplementation] validate"
      )
    }
    if (response.body && (response.status === 201 || response.status === 204)) {
      throw new InvalidResponseBodyError("[MockControllerResponseValidatorImplementation] validate")
    }
  }
}
