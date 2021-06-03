import { GetSignedUserRequest } from "../../types/controller/request.types"
import { GetSignedUserResponse } from "../../types/controller/response.types"

export default interface GetSignedUserController {
  execute(request: GetSignedUserRequest): Promise<GetSignedUserResponse>
}
