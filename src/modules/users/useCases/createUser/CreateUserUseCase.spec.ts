import 'reflect-metadata'

import { CreateUserUseCase } from './CreateUserUseCase'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { AppError } from '../../../../shared/errors/AppError'
import { rejects } from 'assert'

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })
  it ("should be able to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'fakePassword'
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a user with an existing email', async () => {
    await createUserUseCase.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'fakePassword'
    })

    await expect(
      createUserUseCase.execute({
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'fakePassword'
      })
    ).rejects.toEqual(new AppError('User already exists'))
  })
})
