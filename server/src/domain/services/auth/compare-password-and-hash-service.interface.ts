export default interface ComparePasswordAndHashService {
  execute(password: string, hash: string): Promise<boolean>
}
