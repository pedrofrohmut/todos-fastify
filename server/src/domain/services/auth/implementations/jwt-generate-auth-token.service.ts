import * as jwt from "jsonwebtoken"

import GenerateAuthTokenService from "../generate-auth-token-service.interface"

export default class JwtGenerateAuthTokenService implements GenerateAuthTokenService {
  public execute(userId: string, secret: string): string {
    const OneDay = 24 * 60 * 60
    return jwt.sign({ userId }, secret, { expiresIn: OneDay })
  }
}
