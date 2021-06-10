export default interface TaskValidator {
  getMessageForName(name?: string): null | string
  getMessageForDescription(description?: string): null | string
}
