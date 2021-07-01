import { TaskDto } from "../../types/task.types"

export default interface FindTasksByUserIdService {
  execute(userId: string): Promise<TaskDto[]>
}
