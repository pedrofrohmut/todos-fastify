import { AuthenticationToken } from "../../types/auth/token.types"

export default interface TokenDecoderService {
  execute(token: string): AuthenticationToken
}
