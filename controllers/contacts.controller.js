const contactsModel = require('../model/contacts')
const { createResponse } = require('../utils/createResponse')
const { HTTP_CODE } = require('../utils/constants')

const getContacts = async (req, res) => {
  const userId = req.user._id
  const { data, error } = await contactsModel.listContacts(userId, req.query)
  const code = data ? HTTP_CODE.OK : HTTP_CODE.BAD_CONTENT

  return createResponse(res, data, error, code)
}

const getContactById = async (req, res) => {
  const userId = req.user._id
  const { id } = req.params
  const { data, error } = await contactsModel.getContactById(id, userId)
  const code = data ? HTTP_CODE.OK : HTTP_CODE.BAD_CONTENT

  return createResponse(res, data, error, code)
}

const addContact = async (req, res) => {
  const userId = req.user._id
  const { body } = req
  const { data, error } = await contactsModel.addContact(body, userId)
  const code = data ? HTTP_CODE.CREATED : HTTP_CODE.BAD_CONTENT
  
  return createResponse(res, data, error, code)
}

const removeContactById = async (req, res) => {
  const userId = req.user._id
  const { id } = req.params
  const { data, error } = await contactsModel.removeContact(id, userId)
  const code = data ? HTTP_CODE.OK : HTTP_CODE.BAD_CONTENT

  return createResponse(res, data, error, code)
}

const updateContactById = async (req, res) => {
  const userId = req.user._id
  const { id } = req.params
  const { body } = req
  const { data, error } = await contactsModel.updateContact(id, body, userId)
  const code = data ? HTTP_CODE.OK : HTTP_CODE.BAD_CONTENT

  return createResponse(res, data, error, code)
}

module.exports = {
  getContacts,
  getContactById,
  addContact,
  removeContactById,
  updateContactById,
}
