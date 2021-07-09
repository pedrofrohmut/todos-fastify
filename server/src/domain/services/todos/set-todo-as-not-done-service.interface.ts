export default interface SetTodoAsNotDoneService {
  execute(todoId: string): Promise<void>
}
