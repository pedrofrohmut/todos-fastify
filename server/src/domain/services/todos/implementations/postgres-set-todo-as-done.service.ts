import DatabaseConnection from "../../../database/database-connection.interface"
import SetTodoAsDoneService from "../set-todo-as-done-service.interface"

export default class PostgresSetTodoAsNotDoneService implements SetTodoAsDoneService {
  constructor(private readonly connection: DatabaseConnection) {}

  public async execute(todoId: string): Promise<void> {
    this.connection.mutate("UPDATE app.todos SET is_done = true WHERE id = $1", [todoId])
  }
}
