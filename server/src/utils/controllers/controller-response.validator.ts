import { ControllerResponse } from "../types/controller/util.types"

export default class ControllerResponseValidator {
  public static validate(response: ControllerResponse) {
    if (!response) {
      throw new Error("[ControllerExecutor] The controller did not return a response")
    }
    if (!response.status) {
      throw new Error("[ControllerExecutor] The controller did not return a response status")
    }
    if ((response.status === 201 || response.status === 204) && response.body) {
      throw new Error(
        "[ControllerExecutor] The controller returned a body when status where 201 or 204"
      )
    }
  }
}
