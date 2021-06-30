import { TaskDto } from "../../types/task.types"

export default interface FindTaskByIdUseCase {
  execute(userId: string, taskId: string): Promise<TaskDto>
}
