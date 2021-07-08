import { UpdateTodoDto } from "../../../types/todo.types"

import UpdateTodoService from "../update-todo-service.interface"
import DatabaseConnection from "../../../database/database-connection.interface"

export default class PostgresUpdateTodoService implements UpdateTodoService {
  constructor(private readonly connection: DatabaseConnection) {}

  public async execute({ name, description, isDone, id }: UpdateTodoDto): Promise<void> {
    if (description === undefined) {
      description = ""
    }
    this.connection.mutate(
      "UPDATE app.todos SET name = $1, description = $2, is_done = $3 WHERE id = $4",
      [name, description, isDone, id]
    )
  }
}
