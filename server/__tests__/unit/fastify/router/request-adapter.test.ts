import "jest-extended"

import MockRequest from "../../../utils/mocks/fastify-request.mock"

let request: MockRequest

beforeEach(() => {
  request = new MockRequest()
})

describe("RequestAdapter | adapt | invalid request", () => {
  test.todo("Null request throws error")

  test.todo("Undefined request throws error")

  test.todo("Not typeof object throws error")
})

describe("RequestAdapter | adapt | adapt body", () => {
  test.todo("Null body => null request.body")
  test.todo("Undefined => null request.body")
  test.todo("Not typeof object throws error")
})

describe("RequestAdapter | adapt | adapt params", () => {
  test.todo("Null params => null request.params")
  test.todo("Undefined params => null request.params")
  test.todo("Not typeof object throws error")
})

describe("RequestAdapter | adapt | headers to authUserId", () => {
  test.todo("Null headers => null authUserId")
  test.todo("Undefined headers => null authUserId")
  test.todo("Not typeof object headers throws error")
  test.todo("Null token => null authUserId")
  test.todo("Undefined token => null authUserId")
  test.todo("Not typeof object authToken throws error")
  test.todo("Expired token throws error")
  test.todo("Invalid token throws error")
  test.todo("Valid token and not valid userId throws error")
  test.todo("Valid headers and valid token => authUserId")
})
