import TasksApiCaller from "../../../utils/api/tasks-api-caller.util"

describe("[ROUTES] Tasks", () => {
  test("[Route] Create Task", async () => {
    const response = await TasksApiCaller.createTask(undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Delete Task", async () => {
    const response = await TasksApiCaller.deleteTask(undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Find Task By Id", async () => {
    const response = await TasksApiCaller.findTaskById(undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Find Tasks By User Id", async () => {
    const response = await TasksApiCaller.findTasksByUserId(undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Update Task", async () => {
    const response = await TasksApiCaller.updateTask(undefined, undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })
})
