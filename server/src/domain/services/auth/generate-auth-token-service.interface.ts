export default interface GenerateAuthTokenService {
  execute(userId: string, exp?: number): string
}
