import { CreateUserDto } from "../../types/user.types"

export default interface CreateUserUseCase {
  execute(newUser: CreateUserDto): Promise<void>
}
