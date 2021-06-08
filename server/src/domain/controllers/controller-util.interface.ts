import { Controller, ControllerResponse } from "../types/controller/util.types"

export default interface ControllerUtil {
  workOn(controller: Function | Controller): Promise<ControllerResponse>
}
