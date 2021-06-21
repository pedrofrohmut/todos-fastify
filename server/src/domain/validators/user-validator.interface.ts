export default interface UserValidator {
  getMessageForId(id?: string): string | null
  getMessageForName(name?: string): string | null
  getMessageForEmail(email?: string): string | null
  getMessageForPassword(passowrd?: string): string | null
}
