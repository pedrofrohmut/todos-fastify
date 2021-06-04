import { CreateUserBody, SignInUserBody } from "../../../src/domain/types/controller/body.types"
import { AuthenticationHeaders } from "../../../src/domain/types/controller/header.types"
import { ApiCallerResponse } from "./api.types"
import AxiosAdapter from "./axios-api-caller.adapter"

export default class UserApiCaller {
  public static async createUser(body: CreateUserBody): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/users"
    const response = await AxiosAdapter.post(url, body)
    return response
  }

  public static async getSignedUser(headers: AuthenticationHeaders): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/users/signed"
    const response = await AxiosAdapter.get(url, headers)
    return response
  }

  public static async signInUser(body: SignInUserBody): Promise<ApiCallerResponse> {
    const url = process.env.SERVER_URL + "/api/users/signin"
    const response = await AxiosAdapter.post(url, body)
    return response
  }
}
