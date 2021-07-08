import { UpdateTaskDto } from "../../../types/task.types"

import UpdateTaskService from "../update-task-service.interface"
import DatabaseConnection from "../../../database/database-connection.interface"

export default class PostgresUpdateTaskService implements UpdateTaskService {
  constructor(private readonly connection: DatabaseConnection) {}

  public async execute({ name, description, id }: UpdateTaskDto): Promise<void> {
    if (description === undefined) {
      description = ""
    }
    this.connection.mutate("UPDATE app.tasks SET name = $1, description = $2 WHERE id = $3", [
      name,
      description,
      id
    ])
  }
}
