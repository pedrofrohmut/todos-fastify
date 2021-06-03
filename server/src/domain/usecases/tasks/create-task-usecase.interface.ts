import { CreateTaskBody } from "../../types/controller.types"

export default interface CreateTaskUseCase {
  execute(newTask: CreateTaskBody, userId: string): Promise<void>
}
