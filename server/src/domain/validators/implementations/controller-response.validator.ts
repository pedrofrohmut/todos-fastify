import { ControllerResponse } from "../../types/router.types"

import ControllerResponseValidator from "../controller-response-validator.interface"

import InvalidResponseBodyError from "../../errors/controllers/invalid-response-body.error"
import InvalidResponseStatusError from "../../errors/controllers/invalid-response-status.error"
import MissingControllerResponseError from "../../errors/controllers/missing-controller-response.error"

export default class ControllerResponseValidatorImplementation
  implements ControllerResponseValidator
{
  public validate(response: ControllerResponse): void {
    if (response === null || response === undefined) {
      throw new MissingControllerResponseError("[ControllerResponseValidator] validate")
    }
    if (response.status === undefined || typeof response.status !== "number") {
      throw new InvalidResponseStatusError("[ControllerResponseValidator] validate")
    }
    if (response.body && (response.status === 201 || response.status === 204)) {
      throw new InvalidResponseBodyError("[ControllerResponseValidator] validate")
    }
  }
}
