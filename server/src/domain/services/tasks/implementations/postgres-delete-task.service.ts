import DatabaseConnection from "../../../database/database-connection.interface"
import DeleteTaskService from "../delete-task-service.interface"

export default class PostgresDeleteTaskService implements DeleteTaskService {
  public readonly connection: DatabaseConnection

  constructor(connection: DatabaseConnection) {
    this.connection = connection
  }

  public async execute(taskId: string): Promise<void> {
    await this.connection.mutate("DELETE FROM app.tasks WHERE id = $1", [taskId])
  }
}
