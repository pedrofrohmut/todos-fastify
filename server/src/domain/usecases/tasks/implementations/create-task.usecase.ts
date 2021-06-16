import { CreateTaskBody } from "../../../types/request/body.types"

import CreateTaskUseCase from "../create-task-usecase.interface"

export default class CreatTaskUseCaseImplementation implements CreateTaskUseCase {
  public async execute(_newTask: CreateTaskBody, _userId: string): Promise<void> {}
}
