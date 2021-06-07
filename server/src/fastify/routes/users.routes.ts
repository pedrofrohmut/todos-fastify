import { FastifyPluginCallback } from "fastify"

import { SignedUserBody } from "../../domain/types/controller/body.types"

import { checkBodyExists } from "./utils/body.util"
import { checkHeadersForAuthentication } from "./utils/headers.util"

/**
 * USERS
 */
const usersRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateUserRoute
  fastify.post("/api/users", async (request, response) => {
    const message = "Cannot create user"
    checkBodyExists(request, response, message)
    response.status(201).send()
  })

  // GetSignedUser
  fastify.get("/api/users/signed", async (request, response) => {
    const message = "Cannot get signed user"
    checkHeadersForAuthentication(request, response, message)
    const responseBody: SignedUserBody = {
      id: "UserId",
      name: "UserName",
      email: "user@email.com",
      token: "TOKEN"
    }
    response.status(200).send(responseBody)
  })

  // SignInUser
  fastify.post("/api/users/signin", async (request, response) => {
    const message = "Cannot sign in user"
    checkBodyExists(request, response, message)
    const responseBody: SignedUserBody = {
      id: "UserId",
      name: "UserName",
      email: "user@email.com",
      token: "TOKEN"
    }
    response.status(200).send(responseBody)
  })
}

export default usersRoutesPluginCallback
