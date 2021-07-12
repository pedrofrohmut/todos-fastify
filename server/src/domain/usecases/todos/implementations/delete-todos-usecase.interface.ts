export default interface DeleteTodoUseCase {
  execute(userId: string, todoId: string): Promise<void>
}
