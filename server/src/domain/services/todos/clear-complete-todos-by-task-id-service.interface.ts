export default interface ClearCompleteTodosByTaskIdService {
  execute(taskId: string): Promise<void>
}
