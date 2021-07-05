import DatabaseConnection from "../../../database/database-connection.interface"
import { CreateTodoDto } from "../../../types/todo.types"

import CreateTodoService from "../create-todo-service.interface"

export default class PostgresCreateTodoService implements CreateTodoService {
  constructor(private readonly connection: DatabaseConnection) {}

  public async execute({ name, description, taskId, userId }: CreateTodoDto): Promise<void> {
    this.connection.mutate(
      "INSERT INTO app.todos (name, description, task_id, user_id) VALUES ($1, $2, $3, $4)",
      [name, description, taskId, userId]
    )
  }
}
