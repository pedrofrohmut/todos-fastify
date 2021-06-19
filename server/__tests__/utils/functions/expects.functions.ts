import "jest-extended"

import { isValidUUIDv4 } from "./validation.functions"

export const expectsToHaveError = (err: any): void => {
  expect(err).toBeTruthy()
  expect(err).toBeInstanceOf(Error)
  expect(err.message).toBeTruthy()
  expect(err.message).toBeString()
}

export const expectsValidUser = (user: any) => {
  expect(user).toBeTruthy()
  expect(user).toBeObject()
  expect(user.id).toBeTruthy()
  expect(user.id).toBeString()
  expect(user.name).toBeTruthy()
  expect(user.name).toBeString()
  expect(user.email).toBeTruthy()
  expect(user.email).toBeString()
  expect(user.passwordHash).toBeTruthy()
  expect(user.passwordHash).toBeString()
}

export const expectsValidUserId = (userId: any): void => {
  expect(userId).toBeTruthy()
  expect(userId).toBeString()
  expect(isValidUUIDv4(userId)).toBeTrue()
}

export const expectsControllerResponse201 = (response: any): void => {
  expect(response.status).toBe(201)
  expect(response.body).toBeUndefined()
}

export const expectsControllerResponse401AndMessage = (response: any): void => {
  expect(response.status).toBe(401)
  expect(response.body).toBeTruthy()
  expect(response.body).toBeString()
}

export const expectsControllerResponse400AndMessage = (response: any): void => {
  expect(response.status).toBe(400)
  expect(response.body).toBeTruthy()
  expect(response.body).toBeString()
}

export const expectsInjectResponse400AndMessage = (response: any): void => {
  expect(response.statusCode).toBe(400)
  expect(response.payload).toBeTruthy()
  expect(response.payload).toBeString()
}

export const expectsInjectResponse500AndMessage = (response: any): void => {
  expect(response.statusCode).toBe(500)
  expect(response.payload).toBeTruthy()
  expect(response.payload).toBeString()
}
