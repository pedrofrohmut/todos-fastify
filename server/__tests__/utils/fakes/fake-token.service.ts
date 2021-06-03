import { v4 as uuid } from "uuid"
import jwt from "jsonwebtoken"

export default class FakeTokenService {
  public static getValid(userId?: string) {
    let id = userId !== undefined ? userId : uuid()
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: 60 })
    return token
  }
}
