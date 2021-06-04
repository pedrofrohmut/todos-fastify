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
    expect(RequestHeadersAdapter.execute({ authorization: null })).toBeNull()
  })

  test("Token not typeof string => null", () => {
    // @ts-ignore
    expect(RequestHeadersAdapter.execute({ authentication_token: 123 })).toBeNull()
    // @ts-ignore
    expect(RequestHeadersAdapter.execute({ authorization: 123 })).toBeNull()
  })

  test("Headers with a string token => { authenticationToken: '...' }", () => {
    expect(RequestHeadersAdapter.execute({ authentication_token: "hello" })).toEqual({
      authenticationToken: "hello"
    })
    expect(RequestHeadersAdapter.execute({ authorization: "hello" })).toEqual({
      authenticationToken: "hello"
    })
  })
})
