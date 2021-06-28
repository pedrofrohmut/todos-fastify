import DatabaseConnection from "../../../database/database-connection.interface"
import { TaskDto, TaskTableDto } from "../../../types/task.types"

import FindTaskByIdService from "../find-task-by-id-service.interface"

export default class PostgresFindTaskByIdService implements FindTaskByIdService {
  private readonly connection: DatabaseConnection

  constructor(connection: DatabaseConnection) {
    this.connection = connection
  }

  public async execute(taskId: string): Promise<TaskDto | null> {
    const queryResultRows = await this.connection.query<TaskTableDto>(
      "SELECT name, description, user_id FROM app.tasks WHERE id = $1",
      [taskId]
    )
    if (queryResultRows.length === 0) {
      return null
    }
    const { name, description, user_id } = queryResultRows[0]
    return {
      id: taskId,
      name,
      description,
      userId: user_id
    }
  }
}
