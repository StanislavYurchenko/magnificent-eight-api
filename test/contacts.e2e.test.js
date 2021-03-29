const request = require('supertest')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const app = require('../app')
const { User, contacts, newContact } = require('../model/__mocks__/data')

dotenv.config()
const SECRET_KEY = process.env.JWT_SECRET
const issueToken = (payload, secret) => jwt.sign(payload, secret)
const token = issueToken({ _id: User._id }, SECRET_KEY, { expiresIn: '240h' })
User.token = token

jest.mock('../model/contacts.js')
jest.mock('../model/users.js')

describe('Testing the route api/contacts', () => {
  describe('Should handle get request', () => {
    it("should return 200 status for get all contacts", async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${User.token}`)
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.data.contacts).toBeInstanceOf(Array)

    })

    it('should return 200 status by id', async () => {
      const contact = contacts[0]
      const res = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${User.token}`)
      expect(res.status).toEqual(200)
      expect(res.body).toBeDefined()
      expect(res.body.data).toHaveProperty('_id')
      expect(res.body.data._id).toBe(contact._id)
    })

    it('should return 400 status by wrong id', async () => {
      const wrongId = '12345'
      const res = await request(app)
        .get(`/api/contacts/${wrongId}`)
        .set('Authorization', `Bearer ${User.token}`)
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
    })
  })
  
  describe('Should handle post request', () => {
    it('should return 201 status create cat', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${User.token}`)
        .send(newContact)
        .set('Accept', 'application/json')
      expect(res.status).toEqual(201)
      expect(res.body).toBeDefined()
    })

    it('should return 400 status for wrong field', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${User.token}`)
        .send({ ...newContact, field: 'wrong' })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
    })

    it('should return 400 status without required field email', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${User.token}`)
        .send({ name: 'Elon Musk', phone:'12345678', password:'qw' })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
    })

    it('should return 400 status without required field name', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${User.token}`)
        .send({ email:'ElonMusk@email.com', phone:"12345678", password:'qw' })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
    })

    it('should return 400 status without required field password', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${User.token}`)
        .send({ email:'ElonMusk@email.com', phone:"12345678", name: 'Elon Musk' })
        .set('Accept', 'application/json')

      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
    })
  })

  // TODO
  
  describe('Should handle patch request', () => {})
  describe('Should handle delete request', () => {})

})