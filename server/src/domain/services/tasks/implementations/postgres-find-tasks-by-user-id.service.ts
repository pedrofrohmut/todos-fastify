import { TaskDto, TaskTableDto } from "../../../types/task.types"

import DatabaseConnection from "../../../database/database-connection.interface"
import FindTasksByUserIdService from "../find-tasks-by-user-id-service.interface"

export default class PostgresFindTasksByUserIdService implements FindTasksByUserIdService {
  constructor(private readonly connection: DatabaseConnection) {}

  private async getQueryResultRows(userId: string) {
    return this.connection.query<TaskTableDto>(
      "SELECT id, name, description FROM app.tasks WHERE user_id = $1",
      [userId]
    )
  }

  private mapRowsToTasks(userId: string, tasks: TaskTableDto[]) {
    return tasks.map(({ id, name, description }) => ({
      id,
      name,
      description,
      userId
    }))
  }

  public async execute(userId: string): Promise<TaskDto[]> {
    const rows = await this.getQueryResultRows(userId)
    if (rows.length === 0) {
      return []
    }
    const tasks = this.mapRowsToTasks(userId, rows)
    return tasks
  }
}
