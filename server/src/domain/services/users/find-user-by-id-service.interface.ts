import { User } from "../../types/user.types"

export default interface FindUserByIdService {
  execute(userId: string): Promise<User>
}
