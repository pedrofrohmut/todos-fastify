export default interface RequestValidator {
  isValidRequest(request?: any): boolean
  getMessageForAuthenticationHeaders(headers?: any): null | string
}
