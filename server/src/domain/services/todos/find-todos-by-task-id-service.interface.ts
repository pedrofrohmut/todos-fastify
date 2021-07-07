import { TodoDto } from "../../types/todo.types"

export default interface FindTodosByTaskIdService {
  execute(taskId: string): Promise<TodoDto[]>
}
