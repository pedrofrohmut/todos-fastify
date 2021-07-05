export type SignedUserDto = {
  id: string
  name: string
  email: string
  token: string
}

export type UserDto = {
  id: string
  name: string
  email: string
  passwordHash: string
}

export type CreateUserDto = Omit<UserDto, "id">

export type UserTableDto = {
  id: string
  name: string
  email: string
  password_hash: string
}
