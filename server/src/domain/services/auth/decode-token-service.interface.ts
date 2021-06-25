import { AuthenticationToken } from "../../types/auth/token.types"

export default interface DecodeTokenService {
  execute(token: string): AuthenticationToken
}
