import ServiceValidator from "../service-validator.interface"

export default class ServiceValidatorImplementation implements ServiceValidator {
  public isValidService(service?: any): boolean {
    if (!service || typeof service !== "object") {
      return false
    }
    const servicePrototype = Object.getPrototypeOf(service)
    const servicePropertyNames = Object.getOwnPropertyNames(servicePrototype)
    const hasExecuteMethod = servicePropertyNames.some(pName => pName === "execute")
    if (!hasExecuteMethod) {
      return false
    }
    return true
  }
}
