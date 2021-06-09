import DeleteTaskUseCase from "../delete-task-usecase.interface"

export default class DeleteTaskUseCaseImplementation implements DeleteTaskUseCase {
  public async execute(_userId: string, _taskId: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
