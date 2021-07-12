import DatabaseConnection from "../../../database/database-connection.interface"
import DeleteTodoService from "../delete-todo-service.interface"

export default class PostgresDeleteTodoService implements DeleteTodoService {
  constructor(private readonly connection: DatabaseConnection) {}

  public async execute(todoId: string): Promise<void> {
    this.connection.mutate("DELETE FROM app.todos WHERE id = $1", [todoId])
  }
}
