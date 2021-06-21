import { UserDto } from "../../types/user.types"

export default interface FindUserByEmailService {
  execute(email: string): Promise<UserDto | null>
}
