import { CreateTaskBody } from "../../types/request/body.types"

export default interface CreateTaskUseCase {
  execute(newTask: CreateTaskBody, userId: string): Promise<void>
}
