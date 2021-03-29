const request = require('supertest')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

const { User, newUser } = require('../model/__mocks__/data')
const app = require('../app')

dotenv.config()
const SECRET_KEY = process.env.JWT_SECRET
const issueToken = (payload, secret) => jwt.sign(payload, secret)
const token = issueToken({ _id: User._id }, SECRET_KEY, { expiresIn: '240h' })
User.token = token

jest.mock('../model/contacts.js')
jest.mock('../model/users.js')


describe('Testing the route auth', () => {
  it('should return 201 registration', async () => {
    const res = await request(app)
      .post(`/auth/register`)
      .send(newUser)
      .set('Accept', 'application/json')

    expect(res.status).toEqual(201)
    expect(res.body).toBeDefined()
  })


  // TODO
  // it('should return 409 registration -  email already used', async () => {})
  // it('should return 200 login', async () => {})
  // it('should return 401 login', async () => {})
  // it('should return 200 upload avatar', async () => {})
})
