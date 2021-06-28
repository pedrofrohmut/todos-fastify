import { TaskDto } from "../../types/task.types"

export default interface FindTaskByIdService {
  execute(taskId: string): Promise<TaskDto | null>
}
