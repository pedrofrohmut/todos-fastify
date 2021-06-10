export default interface UserValidator {
  getMessageForId(id?: string): string | null
}
