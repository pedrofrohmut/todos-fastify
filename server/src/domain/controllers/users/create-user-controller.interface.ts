import { CreateUserRequest } from "../../types/controller/request.types"
import { CreateUserResponse } from "../../types/controller/response.types"

export default interface CreateUserController {
  execute(request: CreateUserRequest): Promise<CreateUserResponse>
}
