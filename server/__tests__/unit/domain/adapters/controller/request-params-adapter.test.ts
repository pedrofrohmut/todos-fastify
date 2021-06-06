import RequestParamsAdapter from "../../../../../src/domain/adapters/controller/request-params.adapter"

describe("RequestParamsAdapter", () => {
  test("params === undefined => null", () => {
    expect(RequestParamsAdapter.execute(undefined)).toBeNull()
  })

  test("params === null => null", () => {
    expect(RequestParamsAdapter.execute(null)).toBeNull()
  })

  test("typeof params !== object => null", () => {
    expect(RequestParamsAdapter.execute(123)).toBeNull()
  })

  test("params empty object => null", () => {
    expect(RequestParamsAdapter.execute({})).toBeNull()
  })

  test("params with only one valid key => { key: value }", () => {
    expect(RequestParamsAdapter.execute({ taskId: "TASK_ID" })).toEqual({ taskId: "TASK_ID" })
    expect(RequestParamsAdapter.execute({ todoId: "TODO_IS" })).toEqual({ todoId: "TODO_IS" })
    expect(RequestParamsAdapter.execute({ userId: "USER_ID" })).toEqual({ userId: "USER_ID" })
  })
})
