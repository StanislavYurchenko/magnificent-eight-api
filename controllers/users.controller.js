const usersModel = require('../model/users')
const { createResponse } = require('../utils/createResponse')
const { HTTP_CODE } = require('../utils/constants')

const getCurrentUser = async (req, res) => {
  const userId = req.user._id
  const { data, error } = await usersModel.findUserById(userId)

  const code = data ? HTTP_CODE.OK : HTTP_CODE.NOT_FOUND
  const user = data
    ? {
        _id: data._id,
        email: data.email,
        subscription: data.subscription,
      }
    : undefined

  return createResponse(res, user, error, code)
}
// NOT sure that it is correct
const updateUser = async (req, res) => {
  const userId = req.user._id
  const { body } = req
  const { data, error } = await usersModel.updateUserById(userId, body)

  const code = data ? HTTP_CODE.OK : HTTP_CODE.NOT_FOUND
  const user = data
    ? {
        _id: data._id,
        email: data.email,
        subscription: data.subscription,
      }
    : undefined

  return createResponse(res, user, error, code)
}

module.exports = {
  getCurrentUser,
  updateUser,
}
