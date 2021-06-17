import { CreateTask } from "../../../../../../src/domain/types/task.types"

import CreateTaskService from "../../../../../../src/domain/services/tasks/create-task-service.interface"

export class MockCreateTaskService implements CreateTaskService {
  public async execute(_newTask: CreateTask): Promise<void> {}
}

export class MockCreateTaskServiceThrowError implements CreateTaskService {
  public async execute(_newTask: CreateTask): Promise<void> {
    throw new Error("MOCK ERROR")
  }
}
