import { CreateTodoDto } from "../../types/todo.types"

export default interface CreateTodoUseCase {
  execute(newTodo: CreateTodoDto): Promise<void>
}
