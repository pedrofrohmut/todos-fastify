import { FastifyReply, FastifyRequest } from "fastify"

import Router from "../router.interface"
import RequestAdapter from "../request-adapter.interface"
import ControllerFactory from "../../../domain/factories/controller-factory.interface"
import ControllerResponseValidator from "../../../domain/validators/controller-response-validator.interface"
import DatabaseConnection from "../../../domain/database/database-connection.interface"

import { AdaptedRequest, Controller } from "../../../domain/types/router.types"

export default class FastifyRouter implements Router {
  private readonly request: FastifyRequest
  private readonly response: FastifyReply
  private readonly requestAdapter: RequestAdapter
  private readonly controllerFactory: ControllerFactory
  private readonly controllerResponseValidator: ControllerResponseValidator
  private readonly connection: DatabaseConnection

  constructor(
    request: FastifyRequest,
    response: FastifyReply,
    requestAdapter: RequestAdapter,
    controllerFactory: ControllerFactory,
    controllerResponseValidator: ControllerResponseValidator,
    connection: DatabaseConnection
  ) {
    this.request = request
    this.response = response
    this.requestAdapter = requestAdapter
    this.controllerFactory = controllerFactory
    this.controllerResponseValidator = controllerResponseValidator
    this.connection = connection
  }

  public async routeController(controller: Function | Controller<any, any>): Promise<void> {
    let adaptedRequest: AdaptedRequest<any>
    try {
      adaptedRequest = this.requestAdapter.adapt(this.request)
    } catch (err) {
      this.response.status(400).send(err.message)
      return
    }
    try {
      await this.connection.open()
      const controllerInstance = this.controllerFactory.getController(controller, this.connection)
      const controllerResponse = await controllerInstance!.execute(adaptedRequest)
      this.controllerResponseValidator.validate(controllerResponse)
      const { status, body } = controllerResponse
      this.response.status(status).send(body)
    } catch (err) {
      this.response.status(500).send(err.message)
    } finally {
      await this.connection.close()
    }
  }
}
