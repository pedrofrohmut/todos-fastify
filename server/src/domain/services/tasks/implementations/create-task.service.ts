import DatabaseConnection from "../../../database/database-connection.interface"
import { CreateTask } from "../../../types/task.types"
import CreateTaskService from "../create-task-service.interface"

export default class CreateTaskServiceImplementation implements CreateTaskService {
  private readonly connection: DatabaseConnection

  constructor(connection: DatabaseConnection) {
    this.connection = connection
  }

  public async execute({ name, description, userId }: CreateTask): Promise<void> {
    await this.connection.mutate(
      "INSERT INTO app.tasks (name, description, userId) VALUES ($1, $2, $3)",
      [name, description, userId]
    )
  }
}
