import TodosApiCaller from "../../../utils/api/todos-api-caller.util"

describe("[ROUTES] Todos", () => {
  test("[Route] Clear Complete Todos By Task Id", async () => {
    const response = await TodosApiCaller.clearCompleteTodosByTaskId(undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Create Todo", async () => {
    const response = await TodosApiCaller.createTodo(undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Delete Todo", async () => {
    const response = await TodosApiCaller.deleteTodo(undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Find Todo By Id", async () => {
    const response = await TodosApiCaller.findTodoById(undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Find Todos By Task Id", async () => {
    const response = await TodosApiCaller.findTodosByTaskId(undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Set Todo As Done", async () => {
    const response = await TodosApiCaller.setTodoAsDone(undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Set Todo As Not Done", async () => {
    const response = await TodosApiCaller.setTodoAsNotDone(undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })

  test("[Route] Update Todo", async () => {
    const response = await TodosApiCaller.updateTodo(undefined, undefined, undefined)
    expect(response).toBeDefined()
    expect(response.status).toBeDefined()
    expect(response.status).not.toBe(404)
  })
})
