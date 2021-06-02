import { FastifyPluginCallback } from "fastify"

/**
 * USERS
 */
const usersRoutesPluginCallback: FastifyPluginCallback = async (fastify, _options) => {
  // CreateUser
  fastify.post("/api/users", async (_request, _response) => {
    return "Create User"
  })

  // GetSignedUser
  fastify.get("/api/users/signed", async (_request, _response) => {
    return "Get Signed User"
  })

  // SignInUser
  fastify.post("/api/users/signin", async (_request, _response) => {
    return "Sign In User"
  })
}

export default usersRoutesPluginCallback
