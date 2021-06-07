import { Controller, ControllerResponse } from "./controller-executor.types"

export default interface ControllerExecutor {
  execute(controller: Function | Controller): Promise<ControllerResponse>
}
