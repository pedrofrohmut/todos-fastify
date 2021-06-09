// test("Null headers returns Unauthorized", async () => {
//   const request = { body: validBody, headers: null, params: null }
//   // Given
//   expect(request.headers).toBeNull()
//   // When
//   const response = await ControllerFactory.getController(CreateTaskControllerImplementation).execute(request)
//   // Then
//   expect(response.status).toBe(401)
//   expect(response.body).toBeDefined()
//   expect(response.body).toBeString()
// })

// test("Headers not null but null token returns Unathorized", async () => {
//   const headers = { authenticationToken: null }
//   const request = { body: validBody, headers, params: null }
//   // Given
//   expect(request.headers.authenticationToken).toBeNull()
//   // When
//   const response = await ControllerFactory.getController(CreateTaskControllerImplementation).execute(request)
//   // Then
//   expect(response.status).toBe(401)
//   expect(response.body).toBeDefined()
//   expect(response.body).toBeString()
// })

// test("Headers with expired token returns Unathorized", async () => {
//   const headers = { authenticationToken: FakeTokenService.getExpired() }
//   let decodeErr: Error = undefined
//   try {
//     FakeTokenService.decode(headers.authenticationToken)
//   } catch (err) {
//     decodeErr = err
//   }
//   const request = { body: validBody, headers, params: null }
//   // Given
//   expect(decodeErr).toBeDefined()
//   expect(decodeErr).toBeInstanceOf(ExpiredTokenError)
//   // When
//   const response = await ControllerFactory.getController(CreateTaskControllerImplementation).execute(request)
//   // Then
//   expect(response.status).toBe(401)
//   expect(response.body).toBeDefined()
//   expect(response.body).toBeString()
// })
