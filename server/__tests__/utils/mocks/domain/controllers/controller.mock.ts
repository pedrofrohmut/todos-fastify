import { AdaptedRequest, ControllerResponse } from "../../../../../src/domain/types/router.types"

export const MockControllerStatusPayload = (status: number, payload?: any) =>
  jest.fn().mockImplementation(() => ({
    execute: jest.fn(() => ({ status, body: payload }))
  }))

export class MockControllerRequestAsPayload {
  private readonly status: number = 200

  constructor(status: number) {
    this.status = status
  }

  public async execute(request: AdaptedRequest<any>) {
    return {
      status: this.status,
      body: request
    }
  }
}

export const MockControllerArgsAsResponse = (args: any) =>
  jest.fn().mockImplementation(() => ({
    execute: jest.fn(() => args)
  }))

export class MockControllerNotListed {
  public async execute(request: AdaptedRequest<any>) {}
}

export class MockControllerPlaceholder {
  public async execute(_request: AdaptedRequest<any>): Promise<ControllerResponse<any>> {
    return null
  }
}

export class MockControllerExecuteThrowError {
  public async execute(_request: AdaptedRequest<any>): Promise<ControllerResponse<any>> {
    throw new Error("MESSAGE")
  }
}

export const mockExecute = jest.fn()

const MockController = jest.fn().mockImplementation(() => ({
  execute: mockExecute
}))

export const MockControllerNoExecute = jest.fn().mockImplementation(() => ({}))

export default MockController
