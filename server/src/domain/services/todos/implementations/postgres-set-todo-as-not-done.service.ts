import DatabaseConnection from "../../../database/database-connection.interface"
import SetTodoAsNotDoneService from "../set-todo-as-not-done-service.interface"

export default class PostgresSetTodoAsNotDoneService implements SetTodoAsNotDoneService {
  constructor(private readonly connection: DatabaseConnection) {}

  public async execute(todoId: string): Promise<void> {
    this.connection.mutate("UPDATE app.todos SET is_done = false WHERE id = $1", [todoId])
  }
}
