import { FastifyReply, FastifyRequest } from "fastify"

import Router from "./router.interface"

export default interface RouterBuilder {
  buildRouter(request: FastifyRequest, response: FastifyReply): Router
}
