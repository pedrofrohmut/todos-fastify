import { TaskDto } from "../../types/task.types"

export default interface FindTasksByUserIdUseCase {
  execute(userId: string): Promise<TaskDto[]>
}
