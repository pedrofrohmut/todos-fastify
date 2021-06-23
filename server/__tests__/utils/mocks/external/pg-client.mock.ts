export const mockConnect = jest.fn()

export const mockEnd = jest.fn()

export const mockQuery = jest.fn()

const MockPgClient = jest.fn().mockImplementation(() => ({
  connect: mockConnect,
  end: mockEnd,
  query: mockQuery
}))

export const MockPgClientAcceptConnect = (mockConnect: jest.Mock) =>
  jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    end: mockEnd,
    query: mockQuery
  }))

export const MockPgClientAcceptEnd = (mockEnd: jest.Mock) =>
  jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    end: mockEnd,
    query: mockQuery
  }))

export const MockPgClientAcceptQuery = (mockQuery: jest.Mock) =>
  jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    end: mockEnd,
    query: mockQuery
  }))

export default MockPgClient
