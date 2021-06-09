import { FastifyPluginCallback } from "fastify"

import CreateUserControllerImplementation from "../../domain/controllers/users/implementations/create-user.controller"
import GetSignedUserControllerImplementation from "../../domain/controllers/users/implementations/get-signed-user.controller"
import SignInUserControllerImplementation from "../../domain/controllers/users/implementations/sign-in-user.controller"

import ControllerUtil from "../../utils/controllers/controller.util"
import { checkBodyExists } from "../../utils/routes/body.util"
import { checkHeadersForAuthentication } from "../../utils/routes/headers.util"

/**
 * USERS
 */
const usersRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateUserRoute
  fastify.post("/api/users", async (request, response) => {
    const message = "Cannot create user"
    checkBodyExists(request, response, message)
    new ControllerUtil(request, response).workOn(CreateUserControllerImplementation)
  })

  // GetSignedUser
  fastify.get("/api/users/signed", async (request, response) => {
    const message = "Cannot get signed user"
    checkHeadersForAuthentication(request, response, message)
    new ControllerUtil(request, response).workOn(GetSignedUserControllerImplementation)
  })

  // SignInUser
  fastify.post("/api/users/signin", async (request, response) => {
    const message = "Cannot sign in user"
    checkBodyExists(request, response, message)
    new ControllerUtil(request, response).workOn(SignInUserControllerImplementation)
  })
}

export default usersRoutesPluginCallback
