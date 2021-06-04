export type AxiosRequest = {
  URL: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: any
  headers?: any
}

export type ApiCallerResponse = {
  status: number
  body?: any
}
