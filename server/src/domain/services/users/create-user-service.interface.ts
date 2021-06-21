import { CreateUser } from "../../types/user.types"

export default interface CreateUserService {
  execute(newUser: CreateUser): Promise<void>
}
