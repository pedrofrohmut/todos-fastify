import { TaskDto } from "../../types/task.types"

export default interface UpdateTaskUseCase {
  execute(updatedTask: TaskDto): Promise<void>
}
