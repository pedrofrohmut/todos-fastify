export default interface GenerateAuthTokenService {
  execute(userId: string, secret: string): string
}
