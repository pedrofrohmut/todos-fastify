export default interface HashPasswordService {
  execute(password: string): Promise<string>
}
