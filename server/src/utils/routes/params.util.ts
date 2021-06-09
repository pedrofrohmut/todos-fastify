import { FastifyReply, FastifyRequest } from "fastify"

export const checkParamsForTaskId = (
  request: FastifyRequest,
  response: FastifyReply,
  message: string
) => {
  const { taskId } = request.params as { taskId: string }
  if (!request.params || !taskId) {
    response.status(400).send(message + ". There is no taskId defined in the url as a parameter")
  }
}

export const checkParamsForTodoId = (
  request: FastifyRequest,
  response: FastifyReply,
  message: string
) => {
  const { todoId } = request.params as { todoId: string }
  if (!request.params || !todoId) {
    response.status(400).send(message + ". There is no todoId defined in the url as a parameter")
  }
}

export const checkParamsForUserId = (
  request: FastifyRequest,
  response: FastifyReply,
  message: string
) => {
  const { userId } = request.params as { userId: string }
  if (!request.params || !userId) {
    response.status(400).send(message + ". There is no userId defined in the url as a parameter")
  }
}
