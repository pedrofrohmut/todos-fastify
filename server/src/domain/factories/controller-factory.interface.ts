import DatabaseConnection from "../database/database-connection.interface"
import { Controller } from "../types/router.types"

export default interface ControllerFactory {
  getController(
    controller: Function | Controller<any, any>,
    connection: DatabaseConnection
  ): Controller<any, any> | null
}
