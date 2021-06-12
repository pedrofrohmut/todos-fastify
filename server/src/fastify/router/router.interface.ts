import { Controller } from "../../domain/types/router.types"

export default interface Router {
  routeController(controller: Function | Controller): Promise<void>
}
