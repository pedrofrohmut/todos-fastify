import axios from "axios"

describe("[ROUTES] Tasks", () => {
  test("[Route] Create Task", async () => {
    let response = undefined
    try {
      response = await axios.post(process.env.SERVER_URL + "/api/tasks/user/1", {})
      expect(response).toBeDefined()
    } catch (err) {
      expect(err).toBeDefined()
      expect(err.response).toBeDefined()
      expect(err.response.status).toBeDefined()
      expect(err.response.status).not.toBe(404)
    }
  })

  test("[Route] Delete Task", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.delete(process.env.SERVER_URL + "/api/tasks/1")
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
      response = await axios.get(process.env.SERVER_URL + "/api/tasks/1")
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
      response = await axios.get(process.env.SERVER_URL + "/api/tasks/user/1")
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
      response = await axios.put(process.env.SERVER_URL + "/api/tasks/1", {})
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })
})
