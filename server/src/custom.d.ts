import Router from "./fastify/router/router.interface"

declare module "fastify" {
  interface FastifyRequest {
    router: Router
  }
}
