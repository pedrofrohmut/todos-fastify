import { FastifyReply, FastifyRequest } from "fastify"

import FastifyControllerAdapter from "../../../domain/adapters/fastify-controller.adapter"

const callAdapterWith = (controller: any, request: FastifyRequest, response: FastifyReply) => {
  console.log(controller)
  const controllerInstance = controller.getInstance()
  const controllerAdapter = new FastifyControllerAdapter(request, response)
  controllerAdapter.executeController(controllerInstance)
}

export default callAdapterWith
