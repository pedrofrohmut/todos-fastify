import { TodoDto } from "../../types/todo.types"

export default interface FindTodoByIdService {
  execute(todoId: string): Promise<TodoDto | null>
}
