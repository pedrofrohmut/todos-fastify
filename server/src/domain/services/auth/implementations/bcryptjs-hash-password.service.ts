import * as bcrypt from "bcryptjs"

import HashPasswordService from "../hash-password-service.interface"

export default class BcryptjsHashPasswordService implements HashPasswordService {
  public async execute(password: string): Promise<string> {
    const hash = bcrypt.hash(password, 8)
    return hash
  }
}
