export default interface SetTodoAsDoneService {
  execute(todoId: string): Promise<void>
}
