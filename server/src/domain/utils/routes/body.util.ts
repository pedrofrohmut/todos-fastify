import { FastifyReply, FastifyRequest } from "fastify"

export const checkBodyExists = (
  request: FastifyRequest,
  response: FastifyReply,
  message: string
) => {
  const body = request.body as object
  if (!body || (typeof body === "object" && Object.keys(body).length === 0)) {
    response.status(400).send(message + ". The request body is not defined or empty")
  }
}
