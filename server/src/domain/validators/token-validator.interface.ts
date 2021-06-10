export default interface TokenValidator {
  getMessageForToken(token?: any): string | null
}
