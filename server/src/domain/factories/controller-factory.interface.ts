import { Controller } from "../types/router.types"

export default interface ControllerFactory {
  getController(controller: Function | Controller): object
}
