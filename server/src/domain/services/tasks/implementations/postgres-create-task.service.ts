import DatabaseConnection from "../../../database/database-connection.interface"
import { CreateTaskDto } from "../../../types/task.types"
import CreateTaskService from "../create-task-service.interface"

export default class PostgresCreateTaskService implements CreateTaskService {
  private readonly connection: DatabaseConnection

  constructor(connection: DatabaseConnection) {
    this.connection = connection
  }

  public async execute({ name, description, userId }: CreateTaskDto): Promise<void> {
    this.connection.mutate(
      "INSERT INTO app.tasks (name, description, user_id) VALUES ($1, $2, $3)",
      [name, description, userId]
    )
  }
}
