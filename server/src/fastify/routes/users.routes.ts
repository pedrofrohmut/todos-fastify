import { FastifyPluginCallback } from "fastify"

import CreateUserControllerImplementation from "../../domain/controllers/users/implementations/create-user.controller"
import GetSignedUserControllerImplementation from "../../domain/controllers/users/implementations/get-signed-user.controller"
import SignInUserControllerImplementation from "../../domain/controllers/users/implementations/sign-in-user.controller"

import FastifyRouterBuilder from "../router/implementations/fastify-router.builder"

/**
 * USERS
 */
const usersRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateUserRoute
  fastify.post("/api/users", async (request, response) => {
    const router = new FastifyRouterBuilder(request, response).buildRouter()
    router.routeController(CreateUserControllerImplementation)
  })

  // GetSignedUser
  fastify.get("/api/users/signed", async (request, response) => {
    const router = new FastifyRouterBuilder(request, response).buildRouter()
    router.routeController(GetSignedUserControllerImplementation)
  })

  // SignInUser
  fastify.post("/api/users/signin", async (request, response) => {
    const router = new FastifyRouterBuilder(request, response).buildRouter()
    router.routeController(SignInUserControllerImplementation)
  })
}

export default usersRoutesPluginCallback
