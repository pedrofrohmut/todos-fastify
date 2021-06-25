import "jest-extended"

import { isValidUUIDv4 } from "./validation.functions"

export const expectsToHaveError = (err: any, instance?: any): void => {
  expect(err).toBeTruthy()
  expect(err).toBeInstanceOf(Error)
  expect(err.message).toBeTruthy()
  expect(err.message).toBeString()
  if (instance) {
    expect(err).toBeInstanceOf(instance)
  }
}

export const expectsValidConnection = (con: any): void => {
  expect(con).toBeTruthy()
  expect(con).toBeObject()
  expect(con.open).toBeDefined()
  expect(con.close).toBeDefined()
  expect(con.query).toBeDefined()
  expect(con.mutate).toBeDefined()
}

export const expectsValidService = (service: any): void => {
  expect(service).toBeTruthy()
  expect(service).toBeObject()
  expect(service.execute).toBeDefined()
}

export const expectsValidDBService = (service: any): void => {
  expect(service).toBeTruthy()
  expect(service).toBeObject()
  expect(service.execute).toBeDefined()
  expect(service.connection).toBeTruthy()
}

export const expectsValidTokenOneHourExpiration = (
  token: any,
  decoded: any,
  userId: string
): void => {
  expect(token).toBeTruthy()
  expect(token).toBeString()
  expect(decoded).toBeTruthy()
  expect(decoded).toBeObject()
  expect(decoded.userId).toBe(userId)
  const oneDay = 24 * 60 * 60
  expect(decoded.exp).toBe(decoded.iat + oneDay)
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

export const expectsInjectResponse201 = (response: any): void => {
  expect(response.statusCode).toBe(201)
  expect(response.payload).toBeFalsy()
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
