import { AdapterRequest } from "../adapters/controller-adapter.types"
import { ControllerResponse } from "../types/controller.types"

export default interface Controller {
  execute(request: AdapterRequest): Promise<ControllerResponse>
}
