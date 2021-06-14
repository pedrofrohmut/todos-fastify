import { AuthenticationToken } from "../../../types/auth/token.types"

import TokenDecoderService from "../token-decoder-service.interface"

export default class TokenDecoderServiceImplementation implements TokenDecoderService {
  public execute(_token: string): AuthenticationToken {
    throw new Error("Method not implemented.")
  }
}
