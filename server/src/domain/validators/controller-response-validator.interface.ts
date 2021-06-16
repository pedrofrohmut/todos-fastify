import { ControllerResponse } from "../types/router.types"

export default interface ControllerResponseValidator {
  validate(controllerResponse: ControllerResponse<any>): void
}
