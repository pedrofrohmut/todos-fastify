import { CreateTaskBody } from "../../types/controller/body.types"

export default interface CreateTaskUseCase {
  execute(newTask: CreateTaskBody, userId: string): Promise<void>
}
