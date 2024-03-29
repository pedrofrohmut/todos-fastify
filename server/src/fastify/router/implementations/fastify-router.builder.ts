import { FastifyRequest, FastifyReply } from "fastify"

import ControllerFactory from "../../../domain/factories/controller-factory.interface"
import ControllerResponseValidator from "../../../domain/validators/controller-response-validator.interface"
import DatabaseConnection from "../../../domain/database/database-connection.interface"
import RequestAdapter from "../request-adapter.interface"
import Router from "../router.interface"
import RouterBuilder from "../router-builder.interface"

import ControllerFactoryImplementation from "../../../domain/factories/implementations/controller.factory"
import ControllerResponseValidatorImplementation from "../../../domain/validators/implementations/controller-response.validator"
import FastifyRequestAdapter from "./fastify-request.adapter"
import FastifyRouter from "./fastify.router"
import JwtDecodeTokenService from "../../../domain/services/auth/implementations/jwt-decode-token.service"
import PostgresConnectionFactory from "../../../domain/factories/implementations/postgres-connection.factory"

import DependencyInjectionError from "../../../domain/errors/dependencies/dependency-injection.error"

export default class FastifyRouterBuilder implements RouterBuilder {
  private readonly request: FastifyRequest
  private readonly response: FastifyReply
  private readonly requestAdapter: RequestAdapter
  private readonly controllerFactory: ControllerFactory
  private readonly controllerResponseValidator: ControllerResponseValidator
  private readonly connection: DatabaseConnection

  constructor(request: FastifyRequest, response: FastifyReply, jwtSecret: string) {
    if (!this.isValidArguments(request, response, jwtSecret)) {
      throw new DependencyInjectionError("[FastifyRouterBuilder] constructor")
    }
    this.request = request
    this.response = response
    const tokenDecoderService = new JwtDecodeTokenService(jwtSecret)
    this.requestAdapter = new FastifyRequestAdapter(tokenDecoderService)
    this.controllerFactory = new ControllerFactoryImplementation()
    this.controllerResponseValidator = new ControllerResponseValidatorImplementation()
    this.connection = new PostgresConnectionFactory().getConnection()
  }

  private isValidRequest(request: FastifyRequest): boolean {
    return request !== null && request !== undefined && typeof request === "object"
  }

  private isValidResponse(response: FastifyReply): boolean {
    return response !== null && response !== undefined && typeof response === "object"
  }

  private isValidJwtSecret(jwtSecret: string): boolean {
    return jwtSecret !== null && jwtSecret !== undefined && typeof jwtSecret === "string"
  }

  private isValidArguments(
    request: FastifyRequest,
    response: FastifyReply,
    jwtSecret: string
  ): boolean {
    return (
      this.isValidRequest(request) &&
      this.isValidResponse(response) &&
      this.isValidJwtSecret(jwtSecret)
    )
  }

  public buildRouter(): Router {
    const router = new FastifyRouter(
      this.request,
      this.response,
      this.requestAdapter,
      this.controllerFactory,
      this.controllerResponseValidator,
      this.connection
    )
    return router
  }
}
