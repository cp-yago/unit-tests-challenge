import request from 'supertest'
import { Connection } from 'typeorm'

import { app } from '../../../../app'
import createConnection from '../../../../database'
import { AppError } from '../../../../shared/errors/AppError'

let connection: Connection
describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a user', async () => {
    const response = await request(app).post('/api/v1/users/').send({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '12341234'
    })

    expect(response.status).toBe(201)
  })

  it('should not be able to create an existing user', async () => {
    await request(app).post('/api/v1/users/').send({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '12341234'
    })

    const response = await request(app).post('/api/v1/users/').send({
      name: 'John Doe',
      email: 'johndoe@test.com',
      password: '12341234'
    })

    expect(response.status).toBe(400)
  })
})
