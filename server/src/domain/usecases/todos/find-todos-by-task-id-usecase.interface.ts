import { TodoDto } from "../../types/todo.types"

export default interface FindTodosByTaskIdUseCase {
  execute(userId: string, taskId: string): Promise<TodoDto[]>
}
