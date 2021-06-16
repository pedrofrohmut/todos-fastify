import { Controller } from "../../types/router.types"

import ControllerFactory from "../controller-factory.interface"

export default class ControllerFactoryImplementation implements ControllerFactory {
  public getController(_controller: Function | Controller<any, any>): Controller<any, any> {
    throw new Error("Method not implemented.")
  }
}
