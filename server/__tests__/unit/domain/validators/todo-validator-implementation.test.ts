import TodoValidatorImplementation from "../../../../src/domain/validators/implementations/todo.validator"

import { expectsTruthyMessage } from "../../../utils/functions/expects.functions"

const todoValidator = new TodoValidatorImplementation()

describe("TodoValidatorImplementation | getMessageForName", () => {
  test("Null => message", () => {
    expectsTruthyMessage(todoValidator.getMessageForName(null))
  })

  test("Undefined => message", () => {
    expectsTruthyMessage(todoValidator.getMessageForName(undefined))
  })

  test("Not typeof string => message", () => {
    expectsTruthyMessage(todoValidator.getMessageForName(123))
  })

  test("Too short (length < 3) => message", () => {
    expectsTruthyMessage(todoValidator.getMessageForName("a"))
  })

  test("Too long (length > 120) => message", () => {
    expectsTruthyMessage(
      todoValidator.getMessageForName(
        "Dolor dolores repudiandae molestiae totam et veritatis? Neque dolorum amet aliquam error deleniti Harum magni sunt hic nam adipisci Mollitia aliquid assumenda mollitia suscipit aliquam Officiis vitae et ut dignissimos aliquid ea. Qui harum reprehenderit enim exercitationem assumenda labore impedit inventore doloremque? Magnam eos eum aliquid laboriosam facere Enim necessitatibus"
      )
    )
  })

  test("Valid => null", () => {
    expect(todoValidator.getMessageForName("Todo Name")).toBeNull()
  })
})

describe("TodoValidatorImplementation | getMessageForDescription", () => {
  test("Too long => message", () => {
    expectsTruthyMessage(
      todoValidator.getMessageForDescription(
        "Ipsum consequatur fugiat ducimus ea maxime? Earum reiciendis sed consectetur perspiciatis officia Quisquam maxime velit fugit consequatur molestiae Porro ducimus consequatur autem odit illum Recusandae nihil nemo minima assumenda ab Minima dolores debitis eius ipsum voluptatibus maiores, tempora? Ipsum asperiores nam neque doloremque sunt Ut ducimus eaque ex magnam maiores!"
      )
    )
  })

  test("Not typeof string => message", () => {
    // @ts-ignore
    expectsTruthyMessage(todoValidator.getMessageForDescription(123))
  })

  test("Valid => null", () => {
    expect(todoValidator.getMessageForDescription("Todo Description")).toBeNull()
  })
})
