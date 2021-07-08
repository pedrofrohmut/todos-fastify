import { UpdateTodoDto } from "../../types/todo.types"

export default interface UpdateTodoService {
  execute(updatedTodo: UpdateTodoDto): Promise<void>
}
