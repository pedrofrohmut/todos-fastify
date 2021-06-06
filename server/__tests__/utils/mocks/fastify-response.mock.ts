import { FastifyContext, FastifyLoggerInstance, FastifyReply, FastifyRequest } from "fastify"
// import { RouteGenericInterface } from "fastify/types/route"
import { ServerResponse, Server, IncomingMessage } from "http"

interface RouteGenericInterface {}

export default class MockResponse implements FastifyReply {
  public statusCode: number
  public payload: object | string

  status(
    statusCode: number
  ): FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown> {
    this.statusCode = statusCode
    return this
  }

  send(
    payload?: unknown
  ): FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown> {
    this.payload = payload as string | object
    return this
  }

  raw: ServerResponse
  context: FastifyContext<unknown>
  log: FastifyLoggerInstance
  request: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>

  code(
    statusCode: number
  ): FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown> {
    throw new Error("Method not implemented.")
  }
  sent: boolean
  header(
    key: string,
    value: any
  ): FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown> {
    throw new Error("Method not implemented.")
  }
  headers(values: {
    [key: string]: any
  }): FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown> {
    throw new Error("Method not implemented.")
  }
  getHeader(key: string): string {
    throw new Error("Method not implemented.")
  }
  getHeaders(): { [key: string]: string | number | string[] } {
    throw new Error("Method not implemented.")
  }
  removeHeader(key: string): void {
    throw new Error("Method not implemented.")
  }
  hasHeader(key: string): boolean {
    throw new Error("Method not implemented.")
  }
  redirect(
    statusCode: number,
    url: string
  ): FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>
  redirect(
    url: string
  ): FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown>
  redirect(
    statusCode: any,
    url?: any
  ): FastifyReply<
    import("http").Server,
    import("http").IncomingMessage,
    import("http").ServerResponse,
    import("fastify/types/route").RouteGenericInterface,
    unknown
  > {
    throw new Error("Method not implemented.")
  }
  hijack(): FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown> {
    throw new Error("Method not implemented.")
  }
  callNotFound(): void {
    throw new Error("Method not implemented.")
  }
  getResponseTime(): number {
    throw new Error("Method not implemented.")
  }
  type(
    contentType: string
  ): FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown> {
    throw new Error("Method not implemented.")
  }
  serializer(
    fn: (payload: any) => string
  ): FastifyReply<Server, IncomingMessage, ServerResponse, RouteGenericInterface, unknown> {
    throw new Error("Method not implemented.")
  }
  serialize(payload: any): string {
    throw new Error("Method not implemented.")
  }
  then(fulfilled: () => void, rejected: (err: Error) => void): void {
    throw new Error("Method not implemented.")
  }
}
