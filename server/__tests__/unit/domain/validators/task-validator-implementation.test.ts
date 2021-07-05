import "jest-extended"

import TaskValidatorImplementation from "../../../../src/domain/validators/implementations/task.validator"
import FakeTaskService from "../../../utils/fakes/task-service.fake"
import { expectsTruthyMessage } from "../../../utils/functions/expects.functions"

const getValidationMessageForName = (name?: any) => {
  return new TaskValidatorImplementation().getMessageForName(name)
}

const expectsInvalidName = (validationMessage: string | null) => {
  expect(validationMessage).toBeTruthy()
  expect(validationMessage).toBeString()
}

const getValidationMessageForDescription = (description?: any) => {
  return new TaskValidatorImplementation().getMessageForDescription(description)
}

const expectsInvalidDescription = (validationMessage: string | null) => {
  expect(validationMessage).toBeTruthy()
  expect(validationMessage).toBeString()
}

const taskValidator = new TaskValidatorImplementation()

describe("TaskValidatorImplementation | getMessageForId", () => {
  test("Null => message", () => {
    expectsTruthyMessage(taskValidator.getMessageForId(null))
  })

  test("Undefined => message", () => {
    expectsTruthyMessage(taskValidator.getMessageForId(undefined))
  })

  test("Not typeof string => message", () => {
    // @ts-ignore
    expectsTruthyMessage(taskValidator.getMessageForId(123))
  })

  test("Not a valid uuidv4 => message", () => {
    expectsTruthyMessage(taskValidator.getMessageForId("123"))
  })

  test("valid id => null", () => {
    const validTaskId = FakeTaskService.getValidTaskId()
    expect(taskValidator.getMessageForId(validTaskId)).toBeNull()
  })
})

describe("TaskValidator | getMessageForName", () => {
  test("Null => message", () => {
    expectsTruthyMessage(taskValidator.getMessageForName(null))
  })

  test("Undefined => message", () => {
    expectsTruthyMessage(taskValidator.getMessageForName(undefined))
  })

  test("Not string => message", () => {
    // @ts-ignore
    expectsTruthyMessage(taskValidator.getMessageForName(123))
  })

  test("Too short => message", () => {
    expectsTruthyMessage(taskValidator.getMessageForName("n"))
  })

  test("Too long => message", () => {
    expectsTruthyMessage(
      taskValidator.getMessageForName(
        "Ipsum nostrum similique dolor aut veritatis? Corporis dolorem eos eos praesentium obcaecati. Ipsum ab eligendi non vitae Ipsum voluptate dolorem magni"
      )
    )
  })

  test("Valid => null", () => {
    expect(taskValidator.getMessageForName("Task Name")).toBeNull()
  })
})

describe("TaskValidator | getMessageForDescription", () => {
  test("Too long => message", () => {
    expectsTruthyMessage(
      taskValidator.getMessageForDescription(
        "Ipsum consequatur fugiat ducimus ea maxime? Earum reiciendis sed consectetur perspiciatis officia Quisquam maxime velit fugit consequatur molestiae Porro ducimus consequatur autem odit illum Recusandae nihil nemo minima assumenda ab Minima dolores debitis eius ipsum voluptatibus maiores, tempora? Ipsum asperiores nam neque doloremque sunt Ut ducimus eaque ex magnam maiores!"
      )
    )
  })

  test("Not string => message", () => {
    // @ts-ignore
    expectsTruthyMessage(taskValidator.getMessageForDescription(123))
  })

  test("Valid => null", () => {
    expect(taskValidator.getMessageForDescription("Task Description")).toBeNull()
  })
})
