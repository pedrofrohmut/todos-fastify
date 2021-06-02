import { AdapterRequest, AdapterResponse } from "../adapters/controller-adapter.types"

export default interface Controller {
  execute(request: AdapterRequest): Promise<AdapterResponse>
}
