export default interface SetTodoAsDoneUseCase {
  execute(userId: string, todoId: string): Promise<void>
}
