export default interface TodoValidator {
  getMessageForId(id?: string): null | string
  getMessageForName(name?: string): null | string
  getMessageForDescription(description?: string): null | string
  getMessageForIsDone(isDone?: boolean): null | string
}
