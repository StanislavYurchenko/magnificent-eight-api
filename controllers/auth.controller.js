const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

const usersModel = require('../model/users')
const { createResponse } = require('../utils/createResponse')
const { HTTP_CODE } = require('../utils/constants')

dotenv.config()
const { JWT_SECRET } = process.env

const register = async (req, res) => {
  const { body } = req
  const { data: user, error: errorReg } = await usersModel.register(body)

  const code = user ? HTTP_CODE.CREATED : HTTP_CODE.CONFLICT

  if (errorReg) {
    return createResponse(res, user, errorReg, code)
  }

  const newUser = user
    ? {
        _id: user._id,
        email: user.email,
        subscription: user.subscription,
      }
    : undefined

  return createResponse(res, newUser, errorReg, code)
}

const login = async (req, res) => {
  console.log('login');
  const { body } = req
  const { data, error } = await usersModel.login(body)
  const code = data ? HTTP_CODE.OK : HTTP_CODE.NOT_FOUND
  if (error) {
    return createResponse(res, data, error, code)
  }

  const payload = { _id: data._id }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '240h' })

  await usersModel.updateToken(data._id, token)

  const user = data
    ? {
        _id: data._id,
        email: data.email,
        subscription: data.subscription,
        token,
      }
    : undefined

  return createResponse(res, user, error, code)
}

const logout = async (req, res) => {
  const userId = req.user.id
  const { data, error } = await usersModel.logout(userId)

  const logoutResult = data && { data: { message: 'Logout success' } }

  return createResponse(res, logoutResult, error)
}

const verify = async (req, res, next) => {
  try {
    const { data, error } = await usersModel.findByVerifyToken(req.params.token)
    if (data) {
      await usersModel.updateVerifyToken(data._id, true, null)

      const result = { message: 'Verification successful' } 
      const code = HTTP_CODE.OK

      return createResponse(res, result, error, code)
    } 

    const result = { message: 'Link is not valid' } 
    const code = HTTP_CODE.NOT_FOUND

    return createResponse(res, result, error, code)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  logout,
  verify,
}
