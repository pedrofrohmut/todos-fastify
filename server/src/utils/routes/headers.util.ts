import { FastifyReply, FastifyRequest } from "fastify"

export const checkHeadersForAuthentication = (
  request: FastifyRequest,
  response: FastifyReply,
  message: string
) => {
  if (!request.headers || !request.headers.authentication_token) {
    response
      .status(401)
      .send(message + ". The request headers has no authentication_token or the token is empty")
  }
}
