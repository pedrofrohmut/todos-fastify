import { CreateTaskDto } from "../../types/task.types"

export default interface CreateTaskService {
  execute(newTask: CreateTaskDto): Promise<void>
}
