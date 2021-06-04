import UsersApiCaller from "../../../utils/api/users-api-caller.util"

describe("[ROUTES] Users", () => {
  test("[Route] Create User", async () => {
    const response = await UsersApiCaller.createUser(undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Get Signed User", async () => {
    const response = await UsersApiCaller.getSignedUser(undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Sign In User", async () => {
    const response = await UsersApiCaller.signInUser(undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })
})
