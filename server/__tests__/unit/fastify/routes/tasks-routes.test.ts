import { buildTestServerWithAllRoutes } from "../../../utils/server/fastify-test.server"

describe("[ROUTES] Tasks", () => {
  const server = buildTestServerWithAllRoutes()

  afterAll(() => {
    server.close()
  })

  test("[Route] Create Task", async () => {
    const response = await server.inject({ method: "POST", url: "/api/tasks" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Delete Task", async () => {
    const response = await server.inject({ method: "DELETE", url: "/api/tasks/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Find Task By Id", async () => {
    const response = await server.inject({ method: "GET", url: "/api/tasks/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Find Tasks By User Id", async () => {
    const response = await server.inject({ method: "GET", url: "/api/tasks/user/1" })
    expect(response.statusCode).not.toBe(404)
  })

  test("[Route] Update Task", async () => {
    const response = await server.inject({ method: "PUT", url: "/api/tasks/1" })
    expect(response.statusCode).not.toBe(404)
  })
})
