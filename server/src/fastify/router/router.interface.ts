import { Controller } from "../../domain/types/router.types"

export default interface Router {
  routeController(controller: Function | Controller<any, any>): Promise<void>
}
