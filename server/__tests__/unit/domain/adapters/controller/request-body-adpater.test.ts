import RequestBodyAdapter from "../../../../../src/domain/adapters/controller/request-body.adapter"

describe("RequestBodyAdapter", () => {
  test("body === undefined => null", () => {
    expect(RequestBodyAdapter.execute(undefined)).toBeNull()
  })

  test("body === null => null", () => {
    expect(RequestBodyAdapter.execute(null)).toBeNull()
  })

  test("body empty => null", () => {
    expect(RequestBodyAdapter.execute({})).toBeNull()
  })

  test("typeof body !== object => null", () => {
    expect(RequestBodyAdapter.execute(123)).toBeNull()
  })

  test("valid body => body", () => {
    expect(RequestBodyAdapter.execute({ foo: "bar" })).toEqual({ foo: "bar" })
  })

  test("valid body not => anotherStuff", () => {
    expect(RequestBodyAdapter.execute({ foo: "bar" })).not.toEqual({ hello: "world" })
  })
})
