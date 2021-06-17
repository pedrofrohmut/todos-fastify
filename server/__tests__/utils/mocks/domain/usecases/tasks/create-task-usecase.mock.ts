import { CreateTaskBody } from "../../../../../../src/domain/types/request/body.types"

import CreateTaskUseCase from "../../../../../../src/domain/usecases/tasks/create-task-usecase.interface"

import UserNotFoundByIdError from "../../../../../../src/domain/errors/users/user-not-found-by-id.error"

export class MockCreateTaskUseCasePlaceholder implements CreateTaskUseCase {
  public async execute(_newTask: CreateTaskBody, _userId: string): Promise<void> {}
}

export class MockCreateTaskUseCaseThrowsUserNotFound implements CreateTaskUseCase {
  public async execute(_newTask: CreateTaskBody, _userId: string): Promise<void> {
    throw new UserNotFoundByIdError()
  }
}
