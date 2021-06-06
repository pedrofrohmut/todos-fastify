import { AdaptedRequest } from "../../../src/domain/adapters/controller/controller-adapter.types"

export class MockControllerStatusPayload {
  private readonly status: number
  private readonly body: object | string

  constructor(status: number, body: object | string) {
    this.status = status
    this.body = body
  }

  public async execute(_request: AdaptedRequest) {
    return {
      status: this.status,
      body: this.body
    }
  }
}

export class MockControllerRequestAsPayload {
  private readonly status: number

  constructor(status: number) {
    this.status = status
  }

  public async execute(request: AdaptedRequest) {
    return {
      status: this.status,
      body: request
    }
  }
}
