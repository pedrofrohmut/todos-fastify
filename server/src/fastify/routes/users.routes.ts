import { FastifyPluginCallback } from "fastify"

import callAdapterWith from "../../domain/adapters/controller/call-adapter-with.function"

import CreateUserControllerImplementation from "../../domain/controllers/users/implementations/create-user.controller"
import GetSignedUserControllerImplementation from "../../domain/controllers/users/implementations/get-signed-user.controller"
import SignInUserControllerImplementation from "../../domain/controllers/users/implementations/sign-in-user.controller"

/**
 * USERS
 */
const usersRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateUser
  fastify.post("/api/users", async (request, response) => {
    callAdapterWith(CreateUserControllerImplementation, request, response)
  })

  // GetSignedUser
  fastify.get("/api/users/signed", async (request, response) => {
    callAdapterWith(GetSignedUserControllerImplementation, request, response)
  })

  // SignInUser
  fastify.post("/api/users/signin", async (request, response) => {
    callAdapterWith(SignInUserControllerImplementation, request, response)
  })
}

export default usersRoutesPluginCallback
