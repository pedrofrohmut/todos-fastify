import axios from "axios"

describe("[ROUTES] Tasks", () => {
  test("[Route] Create Task", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.post(SERVER_URL + "/api/tasks/user/1", {})
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Delete Task", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.delete(SERVER_URL + "/api/tasks/1")
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Find Task By Id", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.get(SERVER_URL + "/api/tasks/1")
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Find Tasks By User Id", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.get(SERVER_URL + "/api/tasks/user/1")
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Update Task", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.put(SERVER_URL + "/api/tasks/1", {})
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })
})
