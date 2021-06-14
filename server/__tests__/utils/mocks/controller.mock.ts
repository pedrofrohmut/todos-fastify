import { AdaptedRequest, ControllerResponse } from "../../../src/domain/types/router.types"

export class MockControllerStatusPayload {
  private readonly status: number
  private readonly body: any

  constructor(status: any, body?: any) {
    this.status = status
    this.body = body
  }

  public async execute(_request?: AdaptedRequest) {
    return {
      status: this.status,
      body: this.body
    }
  }
}

export class MockControllerRequestAsPayload {
  private readonly status: number = 200

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

export class MockControllerArgsAsResponse {
  private readonly args: any

  constructor(args: any) {
    this.args = args
  }

  public async execute(_request?: AdaptedRequest) {
    return this.args
  }
}

export class MockControllerNoExecute {}

export class MockControllerNotListed {}

export class MockControllerPlaceholder {
  public async execute(_request: AdaptedRequest): Promise<ControllerResponse> {
    return null
  }
}

export class MockControllerExecuteThrowError {
  public async execute(_request: AdaptedRequest): Promise<ControllerResponse> {
    throw new Error("MESSAGE")
  }
}
