export default interface ClearCompleteTodosByTaskIdUseCase {
  execute(userId: string, taskId: string): Promise<void>
}
