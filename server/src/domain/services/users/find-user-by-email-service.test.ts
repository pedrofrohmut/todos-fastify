import { User } from "../../types/user.types"

export default interface FindUserByEmailService {
  execute(email: string): Promise<User | null>
}
