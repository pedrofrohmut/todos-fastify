export default interface DeleteTodoService {
  execute(todoId: string): Promise<void>
}
