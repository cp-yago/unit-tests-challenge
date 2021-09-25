import { AppError } from '../../../../shared/errors/AppError'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it("should be able to show a user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'fakePassword'
    })

    const userFound = await showUserProfileUseCase.execute(user.id)

    expect(userFound).toHaveProperty('id')
  })

  it('should not be able to find a non existing user', async () => {
    await expect(
      showUserProfileUseCase.execute('nonExistingId')
    ).rejects.toEqual(new AppError('User not found', 404))
  })
})
