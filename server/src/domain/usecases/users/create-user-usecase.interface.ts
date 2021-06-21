import { CreateUserBody } from "../../types/request/body.types"

export default interface CreateUserUseCase {
  execute(newUser: CreateUserBody): Promise<void>
}
