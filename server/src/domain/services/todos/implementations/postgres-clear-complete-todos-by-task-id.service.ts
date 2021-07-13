import DatabaseConnection from "../../../database/database-connection.interface"
import ClearCompleteTodosByTaskIdService from "../clear-complete-todos-by-task-id-service.interface"

export default class PostgresClearCompleteTodosByTaskIdService
  implements ClearCompleteTodosByTaskIdService
{
  constructor(private readonly connection: DatabaseConnection) {}

  public async execute(taskId: string): Promise<void> {
    this.connection.mutate("DELETE FROM app.todos WHERE task_id = $1", [taskId])
  }
}
