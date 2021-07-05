import { CreateTodoDto } from "../../types/todo.types"

export default interface CreateTodoService {
  execute(newTodo: CreateTodoDto): Promise<void>
}
