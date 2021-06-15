import "jest-extended"

export const expectsToHaveError = (err: any): void => {
  expect(err).toBeTruthy()
  expect(err).toBeInstanceOf(Error)
  expect(err.message).toBeTruthy()
  expect(err.message).toBeString()
}

export const expectsResponse400AndMessage = (response: any): void => {
  expect(response.statusCode).toBe(400)
  expect(response.payload).toBeTruthy()
  expect(response.payload).toBeString()
}

export const expectsResponse500AndMessage = (response: any): void => {
  expect(response.statusCode).toBe(500)
  expect(response.payload).toBeTruthy()
  expect(response.payload).toBeString()
}
