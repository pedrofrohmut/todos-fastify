export const mockOpen = jest.fn()

export const mockClose = jest.fn()

export const mockQuery = jest.fn()

export const mockMutate = jest.fn()

const MockConnection = jest.fn().mockImplementation(() => ({
  open: mockOpen,
  close: mockClose,
  query: mockQuery,
  mutate: mockMutate
}))

export const MockConnectionAcceptQuery = (mockQuery: jest.Mock) =>
  jest.fn().mockImplementation(() => ({
    open: mockOpen,
    close: mockClose,
    query: mockQuery,
    mutate: mockMutate
  }))

export const MockConnectionAcceptMutate = (mockMutate: jest.Mock) =>
  jest.fn().mockImplementation(() => ({
    open: mockOpen,
    close: mockClose,
    query: mockQuery,
    mutate: mockMutate
  }))

export const MockConnectionAcceptQueryAndMutate = (mockQuery: jest.Mock, mockMutate: jest.Mock) =>
  jest.fn().mockImplementation(() => ({
    open: mockOpen,
    close: mockClose,
    query: mockQuery,
    mutate: mockMutate
  }))

export default MockConnection
