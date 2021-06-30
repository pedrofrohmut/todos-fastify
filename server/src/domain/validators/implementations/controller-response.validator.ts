import { ControllerResponse } from "../../types/router.types"

import ControllerResponseValidator from "../controller-response-validator.interface"

import MissingControllerResponseError from "../../errors/controllers/missing-controller-response.error"
import InvalidResponseError from "../../errors/controllers/invalid-response.error"
import InvalidResponseStatusError from "../../errors/controllers/invalid-response-status.error"
import InvalidResponseBodyError from "../../errors/controllers/invalid-response-body.error"

export default class ControllerResponseValidatorImplementation
  implements ControllerResponseValidator
{
  private readonly errorMessage = "[ControllerResponseValidator] validate"

  private validateResponse(response: any): void {
    if (response === null || response === undefined) {
      throw new MissingControllerResponseError(this.errorMessage)
    }
    if (response && typeof response !== "object") {
      throw new InvalidResponseError(this.errorMessage)
    }
  }

  private validateResponseStatus(status: any): void {
    if (status === null || status === undefined || (status && typeof status !== "number")) {
      throw new InvalidResponseStatusError(this.errorMessage)
    }
  }

  private validateResponseBody({ status, body }: any): void {
    if (
      (status === 200 && !body) ||
      (status === 201 && body) ||
      (status === 204 && body) ||
      (status === 400 && !body) ||
      (status === 400 && typeof body !== "string") ||
      (status === 401 && !body) ||
      (status === 401 && typeof body !== "string") ||
      (status === 500 && !body) ||
      (status === 500 && typeof body !== "string")
    ) {
      throw new InvalidResponseBodyError(this.errorMessage)
    }
  }

  public validate(response: ControllerResponse<any>): void {
    this.validateResponse(response)
    this.validateResponseStatus(response.status)
    this.validateResponseBody(response)
  }
}
