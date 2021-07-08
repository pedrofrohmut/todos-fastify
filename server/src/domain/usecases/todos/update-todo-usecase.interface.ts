import { UpdateTodoBody } from "../../types/request/body.types"

export default interface UpdateTodoUseCase {
  execute(userId: string, todoId: string, updatedTodo: UpdateTodoBody): Promise<void>
}
