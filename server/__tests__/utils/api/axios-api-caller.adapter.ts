import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { ApiCallerResponse, AxiosRequest } from "./api.types"

export default class AxiosAdapter {
  private static async getResponse(axiosRequest: AxiosRequest): Promise<AxiosResponse> {
    const { URL, method, body, headers } = axiosRequest
    const axiosOptions: AxiosRequestConfig = headers !== undefined ? { headers } : undefined
    let response: AxiosResponse = undefined
    if (method === "GET") {
      response = await axios.get(URL, axiosOptions)
    }
    if (method === "POST") {
      response = await axios.post(URL, body, axiosOptions)
    }
    if (method === "PUT") {
      response = await axios.put(URL, body, axiosOptions)
    }
    if (method === "PATCH") {
      response = await axios.patch(URL, axiosOptions)
    }
    if (method === "DELETE") {
      response = await axios.delete(URL, axiosOptions)
    }
    if (response === undefined) {
      throw new Error("[AxiosAdapter] Error with axios request. No methods called")
    }
    return response
  }

  private static async request(axiosRequest: AxiosRequest): Promise<ApiCallerResponse> {
    const { URL, method, body, headers } = axiosRequest
    try {
      const response = await this.getResponse({ URL, method, body, headers })
      return {
        status: response.status,
        body: response.data
      }
    } catch (err) {
      if (err.response === undefined) {
        throw err
      }
      return {
        status: err.response.status,
        body: err.response.data
      }
    }
  }

  public static async get(URL: string, headers?: any) {
    const response = await this.request({ URL, method: "GET", headers })
    return response
  }

  public static async post(URL: string, body?: any, headers?: any) {
    const response = await this.request({ URL, method: "POST", body, headers })
    return response
  }

  public static async put(URL: string, body?: any, headers?: any) {
    const response = await this.request({ URL, method: "PUT", body, headers })
    return response
  }

  public static async patch(URL: string, headers?: any) {
    const response = await this.request({ URL, method: "PATCH", headers })
    return response
  }

  public static async delete(URL: string, headers?: any) {
    const response = await this.request({ URL, method: "DELETE", headers })
    return response
  }
}
