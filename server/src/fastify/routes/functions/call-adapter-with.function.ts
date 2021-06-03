import { FastifyReply, FastifyRequest } from "fastify"

import FastifyControllerAdapter from "../../../domain/adapters/fastify-controller.adapter"
import ControllerFactory from "../../../domain/controllers/controller.factory"

const callAdapterWith = (controller: any, request: FastifyRequest, response: FastifyReply) => {
  const controllerInstance = ControllerFactory.getController(controller)
  if (controllerInstance === null) {
    response.status(500).send("[CallAdapterWith] Error to get the controller from factory.")
    return
  }
  const controllerAdapter = new FastifyControllerAdapter(request, response)
  controllerAdapter.executeController(controllerInstance)
}

export default callAdapterWith
