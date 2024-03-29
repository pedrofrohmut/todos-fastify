import { CreateUserDto } from "../../types/user.types"

export default interface CreateUserService {
  execute(newUser: CreateUserDto): Promise<void>
}
