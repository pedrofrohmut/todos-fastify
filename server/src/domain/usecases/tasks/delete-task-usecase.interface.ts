export default interface DeleteTaskUseCase {
  execute(userId: string, taskId: string): Promise<void>
}
