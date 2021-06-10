export default class UseCaseValidator {
  public static isValidUseCase(useCase?: any): boolean {
    if (!useCase || typeof useCase !== "object") {
      return false
    }
    const useCasePrototype = Object.getPrototypeOf(useCase)
    const useCasePropertyNames = Object.getOwnPropertyNames(useCasePrototype)
    const hasExecuteMethod = useCasePropertyNames.some(pName => pName === "execute")
    if (!hasExecuteMethod) {
      return false
    }
    return true
  }
}
