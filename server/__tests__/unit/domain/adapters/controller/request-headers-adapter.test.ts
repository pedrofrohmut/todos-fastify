import RequestHeadersAdapter from "../../../../../src/domain/adapters/controller/request-headers.adapter"

describe("RequestHeadersAdapter", () => {
  test("headers === undefined => null", () => {
    expect(RequestHeadersAdapter.execute(undefined)).toBeNull()
  })

  test("headers === null => null", () => {
    expect(RequestHeadersAdapter.execute(null)).toBeNull()
  })

  test("headers with noAuth => null", () => {
    expect(RequestHeadersAdapter.execute({})).toBeNull()
  })

  test("headers with Auth and noToken => null", () => {
    expect(RequestHeadersAdapter.execute({ authentication_token: null })).toBeNull()
  })

  test("Token not typeof string ", () => {
    expect(() => {
      // @ts-ignore
      RequestHeadersAdapter.execute({ authentication_token: 123 })
    }).toThrowError()
  })

  test("Headers with a string token => { authenticationToken: '...' }", () => {
    expect(RequestHeadersAdapter.execute({ authentication_token: "hello" })).toEqual({
      authenticationToken: "hello"
    })
  })
})
