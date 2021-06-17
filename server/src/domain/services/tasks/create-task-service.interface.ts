import { CreateTask } from "../../types/task.types"

export default interface CreateTaskService {
  execute(newTask: CreateTask): Promise<void>
}
