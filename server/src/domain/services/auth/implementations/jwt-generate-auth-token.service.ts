import * as jwt from "jsonwebtoken"

import GenerateAuthTokenService from "../generate-auth-token-service.interface"

export default class JwtGenerateAuthTokenService implements GenerateAuthTokenService {
  constructor(private readonly secret: string) {}

  public execute(userId: string, exp?: number): string {
    if (!exp) {
      const OneDay = 24 * 60 * 60
      return jwt.sign({ userId }, this.secret, { expiresIn: OneDay })
    }
    return jwt.sign({ userId, exp }, this.secret)
  }
}
