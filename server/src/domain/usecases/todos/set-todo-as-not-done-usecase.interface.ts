export default interface SetTodoAsNotDoneUseCase {
  execute(userId: string, todoId: string): Promise<void>
}
