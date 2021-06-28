import * as bcrypt from "bcryptjs"

import ComparePasswordAndHashService from "../compare-password-and-hash-service.interface"

export default class BcryptjsComparePasswordAndHashService
  implements ComparePasswordAndHashService
{
  public async execute(password: string, hash: string): Promise<boolean> {
    const isMatch = bcrypt.compare(password, hash)
    return isMatch
  }
}
