import { TaskDto } from "../../types/task.types"

export default interface UpdateTaskService {
  execute(updatedTask: TaskDto): Promise<void>
}
