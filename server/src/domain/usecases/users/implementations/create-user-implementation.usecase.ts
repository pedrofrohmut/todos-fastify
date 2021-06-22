import { CreateUserBody } from "../../../types/request/body.types"

import CreateUserUseCase from "../create-user-usecase.interface"
import FindUserByEmailService from "../../../services/users/find-user-by-email-service.interface"
import CreateUserService from "../../../services/users/create-user-service.interface"
import HashPasswordService from "../../../services/auth/hash-password-service.interface"

import EmailAlreadyRegisteredError from "../../../errors/users/email-already-registered.error"

export default class CreateUserUseCaseImplementation implements CreateUserUseCase {
  private readonly findUserByEmailService: FindUserByEmailService
  private readonly hashPasswordService: HashPasswordService
  private readonly createUserService: CreateUserService

  constructor(
    findUserByEmailService: FindUserByEmailService,
    hashPasswordService: HashPasswordService,
    createUserService: CreateUserService
  ) {
    this.findUserByEmailService = findUserByEmailService
    this.hashPasswordService = hashPasswordService
    this.createUserService = createUserService
  }

  public async execute(newUser: CreateUserBody): Promise<void> {
    const { name, email, password } = newUser
    const foundUser = await this.findUserByEmailService.execute(email)
    if (foundUser !== null) {
      throw new EmailAlreadyRegisteredError("[CreateUserUseCase] execute")
    }
    const passwordHash = await this.hashPasswordService.execute(password)
    await this.createUserService.execute({ name, email, passwordHash })
  }
}
