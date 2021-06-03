import axios from "axios"

describe("[ROUTES] Todos", () => {
  test("[Route] Clear Complete Todos By Task Id", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.delete(process.env.SERVER_URL + "/api/todos/task/1")
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Create Todo", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.post(process.env.SERVER_URL + "/api/todos", {})
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Delete Todo", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.delete(process.env.SERVER_URL + "/api/todos/1")
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Find Todo By Id", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.get(process.env.SERVER_URL + "/api/todos/1")
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Find Todos By Task Id", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.get(process.env.SERVER_URL + "/api/todos/task/1")
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Set Todo As Done", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.patch(process.env.SERVER_URL + "/api/todos/setdone/1")
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Set Todo As Not Done", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.patch(process.env.SERVER_URL + "/api/todos/setnotdone/1")
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Update Todo", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.put(process.env.SERVER_URL + "/api/todos/1", {})
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })
})
