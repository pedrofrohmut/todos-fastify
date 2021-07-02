import { v4 as uuid } from "uuid"

export default class FakeTaskService {
  public static getTaskFromService(taskDB: {
    id: string
    name: string
    description: string
    user_id: string
  }) {
    return {
      id: taskDB.id,
      name: taskDB.name,
      description: taskDB.description || "",
      userId: taskDB.user_id
    }
  }

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
