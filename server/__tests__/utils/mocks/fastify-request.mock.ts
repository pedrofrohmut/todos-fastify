import { FastifyLoggerInstance, FastifyRequest } from "fastify"
import { IncomingMessage, IncomingHttpHeaders } from "http"
import { Socket } from "net"

export default class MockRequest implements FastifyRequest {
  id: any
  params: unknown
  raw: IncomingMessage
  query: unknown
  log: FastifyLoggerInstance
  body: unknown
  validationError?: Error & { validation: any; validationContext: string }
  req: IncomingMessage
  headers: IncomingHttpHeaders = {}
  ip: string
  ips?: string[]
  hostname: string
  url: string
  protocol: "http" | "https"
  method: string
  routerPath: string
  routerMethod: string
  is404: boolean
  socket: Socket
  connection: Socket
}
