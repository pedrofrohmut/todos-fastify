const isValidJson = (stringToValidate: string): boolean => {
  try {
    JSON.parse(stringToValidate)
  } catch {
    return false
  }
  return true
}

export default isValidJson
