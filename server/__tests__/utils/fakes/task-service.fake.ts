import { v4 as uuid } from "uuid"

export default class FakeTaskService {
  public static getValidTaskId() {
    return uuid()
  }

  public static getTaskDB(code: string, userId?: string, taskId?: string) {
    return {
      id: taskId || uuid(),
      name: "Task Name " + code,
      description: "Task Description " + code,
      user_id: userId || uuid()
    }
  }
}
