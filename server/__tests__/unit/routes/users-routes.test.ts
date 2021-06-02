import axios from "axios"

describe("[ROUTES] Users", () => {
  test("[Route] Create User", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.post(SERVER_URL + "/api/users", {})
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Clear Complete Todos By Task Id", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.get(SERVER_URL + "/api/users/signed")
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })

  test("[Route] Clear Complete Todos By Task Id", async () => {
    let requestErr = undefined
    let response = undefined
    try {
      response = await axios.post(SERVER_URL + "/api/users/signin", {})
    } catch (err) {
      requestErr = err
    }
    expect(response).toBeDefined()
    expect(requestErr).not.toBeDefined()
  })
})
