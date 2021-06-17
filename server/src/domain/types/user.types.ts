export type SignedUser = {
  id: string
  name: string
  email: string
  token: string
}

export type User = {
  id: string
  name: string
  email: string
  passwordHash: string
}

export type UserTable = {
  id: string
  name: string
  email: string
  password_hash: string
}
