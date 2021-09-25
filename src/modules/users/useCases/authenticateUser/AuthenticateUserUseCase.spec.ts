import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { AppError } from '../../../../shared/errors/AppError';

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase

describe('Authenticate user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to authenticate a user', async () => {
    const user: ICreateUserDTO = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'fakePassword'
    }

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    })

    expect(result).toHaveProperty('token')
  })

  it('should not be able to authenticate a non existing user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'nonExistingUser@test.com',
        password: 'fakePassword',
      })
    ).rejects.toEqual(new AppError("Incorrect email or password", 401))
  })

  it('should not be able to athenticate if password is incorrect', async () => {
    const user: ICreateUserDTO = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'fakePassword'
    }

    await createUserUseCase.execute(user)

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrectPassword',
      })
    ).rejects.toEqual(new AppError("Incorrect email or password", 401))

  })
})
