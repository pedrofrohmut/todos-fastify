export const getSyncError = (callback: Function) => {
  try {
    callback()
    return null
  } catch (err) {
    return err
  }
}

export const getError = async (callback: Function): Promise<null | Error> => {
  try {
    await callback()
    return null
  } catch (err) {
    return err
  }
}
