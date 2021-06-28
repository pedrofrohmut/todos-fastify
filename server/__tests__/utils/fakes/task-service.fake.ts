import { v4 as uuid } from "uuid"

export default class FakeTaskService {
  // public static getNew() {
  //   const randomVal = Math.floor(Math.random() * 1000000)
  //   return {
  //     id: uuid(),
  //     name: "Task Name " + randomVal,
  //     description: "Task Description " + randomVal,
  //     userId: uuid()
  //   }
  // }

  public static getValidTaskId() {
    return uuid()
  }
}
