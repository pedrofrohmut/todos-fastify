import "jest-extended"

import PostgresClearCompleteTodosByTaskIdService from "../../../../../src/domain/services/todos/implementations/postgres-clear-complete-todos-by-task-id.service"

import FakeTaskService from "../../../../utils/fakes/task-service.fake"
import MockConnection from "../../../../utils/mocks/domain/database/database-connection.mock"
import { getError } from "../../../../utils/functions/error.functions"

describe("PostgresClearCompleteTodosByTaskIdService", () => {
  test("Todos should be cleared with no errors", async () => {
    const { clearCompleteTodosByTaskIdService, taskId, connection } = setup()
    const serviceErr = await whenTodosAreClearedByTaskId(clearCompleteTodosByTaskIdService, taskId)
    thenMutateIsCalledAnServiceErrorIsFalsy(serviceErr, connection, taskId)
  })
})

function thenMutateIsCalledAnServiceErrorIsFalsy(serviceErr: Error, connection: any, taskId: string) {
  expect(serviceErr).toBeFalsy()
  expect(connection.mutate).toHaveBeenCalledTimes(1)
  const paramsPassedToDatabase = connection.mutate.mock.calls[0][1]
  expect(paramsPassedToDatabase).toIncludeAllMembers([taskId])
}

async function whenTodosAreClearedByTaskId(
  clearCompleteTodosByTaskIdService: PostgresClearCompleteTodosByTaskIdService,
  taskId: string
) {
  return await getError(() => clearCompleteTodosByTaskIdService.execute(taskId))
}

function setup() {
  const taskId = FakeTaskService.getValidTaskId()
  const connection = MockConnection()
  const clearCompleteTodosByTaskIdService = new PostgresClearCompleteTodosByTaskIdService(
    connection
  )
  return { clearCompleteTodosByTaskIdService, taskId, connection }
}
