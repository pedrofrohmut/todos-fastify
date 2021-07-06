import { TodoDto } from "../../types/todo.types"

export default interface FindTodoByIdUseCase {
  execute(userId: string, todoId: string): Promise<TodoDto | null>
}
