import { Controller } from "../../../src/domain/types/router.types"

import ControllerFactory from "../../../src/domain/factories/controller-factory.interface"

import { MockControllerPlaceholder } from "./controller.mock"

export class MockControllerFactoryImplementation implements ControllerFactory {
  public getController(controller: Function | Controller): Controller {
    if (
      controller === null ||
      controller === undefined ||
      (typeof controller !== "object" && typeof controller !== "function") ||
      (typeof controller === "object" && controller.execute === undefined)
    ) {
      throw new Error("MOCK ERROR")
    }
    if (typeof controller === "object") {
      return controller
    }
    return new MockControllerPlaceholder()
  }
}
