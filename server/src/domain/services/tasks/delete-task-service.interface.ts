export default interface DeleteTaskService {
  execute(taskId: string): Promise<void>
}
