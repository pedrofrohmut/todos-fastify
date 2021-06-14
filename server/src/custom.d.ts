import { IncomingHttpHeaders } from "http"

import Router from "./fastify/router/router.interface"

interface Headers {
  authentication_token: string
}

declare module "fastify" {
  interface FastifyRequest {
    headers: Headers
    router: Router
  }
}
