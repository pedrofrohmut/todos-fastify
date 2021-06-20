export const mockOpen = jest.fn()

export const mockClose = jest.fn()

export const mockQuery = jest.fn()

export const mockMutate = jest.fn()

export const MockConnectionAcceptQuery = (mockQuery: jest.Mock) => jest.fn().mockImplementation(() => ({
  open: mockOpen,
  close: mockClose,
  query: mockQuery,
  mutate: mockMutate
}))
