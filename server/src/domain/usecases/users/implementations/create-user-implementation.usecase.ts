import { CreateUserBody } from "../../../types/request/body.types"

import CreateUserUseCase from "../create-user-usecase.interface"
import FindUserByEmailService from "../../../services/users/find-user-by-email-service.interface"
import CreateUserService from "../../../services/users/create-user-service.interface"

import EmailAlreadyRegisteredError from "../../../errors/users/email-already-registered.error"

export default class CreateUserUseCaseImplementation implements CreateUserUseCase {
  private readonly findUserByEmailService: FindUserByEmailService
  private readonly createUserService: CreateUserService

  constructor(
    findUserByEmailService: FindUserByEmailService,
    createUserService: CreateUserService
  ) {
    this.findUserByEmailService = findUserByEmailService
    this.createUserService = createUserService
  }

  public async execute(newUser: CreateUserBody): Promise<void> {
    const { name, email, password } = newUser
    const foundUser = await this.findUserByEmailService.execute(email)
    if (foundUser !== null) {
      throw new EmailAlreadyRegisteredError("[CreateUserUseCase] execute")
    }
    // TODO: Implement the HashPasswordService
    const passwordHash = "TODO_HASH_" + password
    await this.createUserService.execute({ name, email, passwordHash })
  }
}
