import { UserDto } from "../../types/user.types"

export default interface FindUserByIdService {
  execute(userId: string): Promise<UserDto | null>
}
