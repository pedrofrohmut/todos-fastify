import {
  CreateTaskRequest,
  CreateTaskResponse
} from "../../types/controller.types"

export default interface CreateTaskController {
  execute(request: CreateTaskRequest): Promise<CreateTaskResponse>
}
