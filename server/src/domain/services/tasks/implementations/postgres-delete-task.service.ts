import DatabaseConnection from "../../../database/database-connection.interface"
import DeleteTaskService from "../delete-task-service.interface"

export default class PostgresDeleteTaskService implements DeleteTaskService {
  constructor(public readonly connection: DatabaseConnection) {}

  public async execute(taskId: string): Promise<void> {
    await this.connection.mutate("DELETE FROM app.tasks WHERE id = $1", [taskId])
  }
}
