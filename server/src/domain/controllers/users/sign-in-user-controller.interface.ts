import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { SignInUserResponse } from "../../types/controller/response.types"

export default interface SignInUserController {
  execute(request: AdaptedRequest): Promise<SignInUserResponse>
}
