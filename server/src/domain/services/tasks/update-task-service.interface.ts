import { UpdateTaskDto } from "../../types/task.types"

export default interface UpdateTaskService {
  execute(updatedTask: UpdateTaskDto): Promise<void>
}
