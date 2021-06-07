import CreateTaskUseCase from "../create-task-usecase.interface"

import { CreateTaskBody } from "../../../types/controller/body.types"

export default class CreatTaskUseCaseImplementation implements CreateTaskUseCase {
  public async execute(_newTask: CreateTaskBody, _userId: string): Promise<void> {}
}
