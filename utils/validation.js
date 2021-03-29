const Joi = require('joi')
const mongoose = require('mongoose')
const { HTTP_CODE, SUBSCRIPTIONS_TYPE, DOCUMENT_FILES } = require('./constants')

const newContact = (req, _res, next) => {
  const { body } = req
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    subscription: Joi.string().valid(...Object.values(SUBSCRIPTIONS_TYPE)).default(SUBSCRIPTIONS_TYPE.free),
    password: Joi.string().required(),
    owner: Joi.string().empty('').default(''),
  })
  const validationResult = schema.validate(body)

  try {
    if (validationResult.error) {
      const error = new Error()
      error.message = validationResult.error.message
      error.code = HTTP_CODE.BAD_CONTENT
      throw error
    }
  } catch (error) {
    next(error)
  }

  next()
}

const getContactsQuery = (req, _res, next) => {
  const { query } = req
  const schema = Joi.object({
    limit: Joi.number().max(10).default(5),
    page: Joi.number().min(0).default(1),
    sortBy: Joi.string().valid(...Object.values(DOCUMENT_FILES)),
    sortByDesc: Joi.string().valid(...Object.values(DOCUMENT_FILES)),
    select: Joi.string().valid(...Object.values(DOCUMENT_FILES)),
    sub: Joi.string().valid(...Object.values(SUBSCRIPTIONS_TYPE)),
  })
  const validationResult = schema.validate(query)

  try {
    if (validationResult.error) {
      const error = new Error()
      error.message = validationResult.error.message
      error.code = HTTP_CODE.BAD_CONTENT
      throw error
    }
  } catch (error) {
    next(error)
  }

  next()
}

const updateContact = (req, _res, next) => {
  const { body } = req
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    subscription: Joi.string().valid(...Object.values(SUBSCRIPTIONS_TYPE)),
    password: Joi.string(),
    token: Joi.string().empty(''),
  }).min(1)
  const validationResult = schema.validate(body)

  try {
    if (validationResult.error) {
      const error = new Error()
      error.message = validationResult.error.message
      error.code = HTTP_CODE.BAD_CONTENT
      throw error
    }
  } catch (error) {
    next(error)
  }

  next()
}

const id = (req, _res, next) => {
  const { id } = req.params
  const isIdValid = mongoose.Types.ObjectId.isValid(id)
  try {
    if (!isIdValid) {
      const error = new Error()
      error.message = 'Id is invalid'
      error.code = HTTP_CODE.BAD_CONTENT
      throw error
    }
  } catch (error) {
    next(error)
  }
  next()
}

const auth = (req, _res, next) => {
  const { body } = req
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    subscription: Joi.string().valid(...Object.values(SUBSCRIPTIONS_TYPE)).default(SUBSCRIPTIONS_TYPE.free),
  })
  const validationResult = schema.validate(body)

  try {
    if (validationResult.error) {
      const error = new Error()
      error.message = validationResult.error.message
      error.code = HTTP_CODE.BAD_CONTENT
      throw error
    }
  } catch (error) {
    next(error)
  }

  next()
}

const newUser = (req, _res, next) => {
  const { body } = req
  const schema = Joi.object({
    email: Joi.string().email().required(),
    subscription: Joi.string().valid(...Object.values(SUBSCRIPTIONS_TYPE)).default(SUBSCRIPTIONS_TYPE.free),
    password: Joi.string().required(),
  })
  const validationResult = schema.validate(body)

  try {
    if (validationResult.error) {
      const error = new Error()
      error.message = validationResult.error.message
      error.code = HTTP_CODE.BAD_CONTENT
      throw error
    }
  } catch (error) {
    next(error)
  }

  next()
}

const updateUser = (req, _res, next) => {
  const { body } = req
  const schema = Joi.object({
    email: Joi.string().email(),
    subscription: Joi.string().valid(...Object.values(SUBSCRIPTIONS_TYPE)),
    password: Joi.string(),
  })
  const validationResult = schema.validate(body)

  try {
    if (validationResult.error) {
      const error = new Error()
      error.message = validationResult.error.message
      error.code = HTTP_CODE.BAD_CONTENT
      throw error
    }
  } catch (error) {
    next(error)
  }

  next()
}

const uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error()
      error.message = 'Field of avatar with file not found'
      error.code = HTTP_CODE.BAD_CONTENT
      throw error
    }
  } catch (error) {
    next(error)
  }

  next()
}

module.exports = {
  newContact,
  updateContact,
  id,
  auth,
  newUser,
  getContactsQuery,
  updateUser,
  uploadImage,
}
