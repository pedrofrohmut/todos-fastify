import "jest-extended"

import * as jwt from "jsonwebtoken"

import TokenDecoderService from "../../../../../src/domain/services/auth/token-decoder-service.interface"

import JwtTokenDecoderService from "../../../../../src/domain/services/auth/implementations/jwt-token-decoder.service"

import ExpiredTokenError from "../../../../../src/domain/errors/auth/expired-token.error"
import InvalidTokenError from "../../../../../src/domain/errors/auth/invalid-token.error"

import { expectsToHaveError } from "../../../../utils/functions/expects.functions"
import { getSyncError } from "../../../../utils/functions/error.functions"
import FakeTokenService from "../../../../utils/fakes/token-service.fake"
import FakeUserService from "../../../../utils/fakes/user-service.fake"
import { isValidUUIDv4 } from "../../../../utils/functions/validation.functions"

let tokenDecoderService: TokenDecoderService

beforeAll(() => {
  tokenDecoderService = new JwtTokenDecoderService(process.env.JWT_SECRET)
})

describe("JwtTokenDecoderService | execute | Invalid tokens throws errors", () => {
  test("Falsy throws Invalid Token", () => {
    const token = null
    // Given
    expect(token).toBeFalsy()
    // When
    const decodeErr = getSyncError(() => tokenDecoderService.execute(token))
    // Then
    expectsToHaveError(decodeErr)
    expect(decodeErr).toBeInstanceOf(InvalidTokenError)
  })

  test("Not string throws Invalid Token", () => {
    const token = 123
    // Given
    expect(token).toBeTruthy()
    expect(token).not.toBeString()
    // When
    // @ts-ignore
    const decodeErr = getSyncError(() => tokenDecoderService.execute(token))
    // Then
    expectsToHaveError(decodeErr)
    expect(decodeErr).toBeInstanceOf(InvalidTokenError)
  })

  test("Invalid throws Invalid Token", () => {
    const token = FakeTokenService.getInvalid()
    const jwtVerifyErr = getSyncError(() => jwt.verify(token, process.env.JWT_SECRET))
    // Given
    expect(token).toBeTruthy()
    expect(token).toBeString()
    expectsToHaveError(jwtVerifyErr)
    expect(jwtVerifyErr).toBeInstanceOf(jwt.JsonWebTokenError)
    expect(jwtVerifyErr).not.toBeInstanceOf(jwt.TokenExpiredError)
    // When
    const decodeErr = getSyncError(() => tokenDecoderService.execute(token))
    // Then
    expectsToHaveError(decodeErr)
    expect(decodeErr).toBeInstanceOf(InvalidTokenError)
  })

  test("Expired throws Expired Token", () => {
    const token = FakeTokenService.getExpired()
    const jwtVerifyErr =  getSyncError(() => jwt.verify(token, process.env.JWT_SECRET))
    // Given
    expect(token).toBeTruthy()
    expect(token).toBeString()
    expectsToHaveError(jwtVerifyErr)
    expect(jwtVerifyErr).toBeInstanceOf(jwt.TokenExpiredError)
    // When
    const decodeErr = getSyncError(() => tokenDecoderService.execute(token))
    // Then
    expectsToHaveError(decodeErr)
    expect(decodeErr).toBeInstanceOf(ExpiredTokenError)
  })
})

describe("JwtTokenDecoderService | execute | Valid token", () => {
  test("Valid authentication token returns object with userId", () => {
    const userId = FakeUserService.getValidUserId()
    const token = FakeTokenService.getValid(userId)
    const jwtVerifyErr = getSyncError(() => jwt.verify(token, process.env.JWT_SECRET))
    const decodeErr = getSyncError(() => tokenDecoderService.execute(token))
    // Given
    expect(userId).toBeTruthy()
    expect(userId).toBeString()
    expect(isValidUUIDv4(userId)).toBeTrue()
    expect(token).toBeTruthy()
    expect(token).toBeString()
    expect(jwtVerifyErr).toBeFalsy()
    expect(decodeErr).toBeFalsy()
    // When
    const decodedToken = tokenDecoderService.execute(token)
    // Then
    expect(decodedToken).toBeTruthy()
    expect(decodedToken).toBeObject()
    expect(decodedToken.userId).toBeTruthy()
    expect(decodedToken.userId).toBeString()
    expect(decodedToken.userId).toBe(userId)
  })
})
