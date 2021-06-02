import { AdapterRequest, AdapterResponse } from "../../adapters/controller-adapter.types"
import Controller from "../controller.interface"

export default class CreateTaskController implements Controller {
  private constructor() {}

  public static getInstance() {
    return new CreateTaskController()
  }

  public async execute(request: AdapterRequest): Promise<AdapterResponse> {
    return {
      status: 200,
      body: {
        body: request.body,
        headers: request.headers,
        params: request.params
      }
    }
  }
}
