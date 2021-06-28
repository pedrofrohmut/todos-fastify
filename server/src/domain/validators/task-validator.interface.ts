export default interface TaskValidator {
  getMessageForId(id?: string): null | string
  getMessageForName(name?: string): null | string
  getMessageForDescription(description?: string): null | string
}
