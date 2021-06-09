import { AdaptedRequest } from "../../../utils/types/controller/util.types"
import { GetSignedUserResponse } from "../../types/controller/response.types"

export default interface GetSignedUserController {
  execute(request: AdaptedRequest): Promise<GetSignedUserResponse>
}
