const rateLimit = require('express-rate-limit')

const { HTTP_CODE } = require('./constants')

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  handler: (_req, _res, next) => {
    try {
      const error = new Error()
      error.message = 'Asses is denied, max limit for requests, please try again later'
      error.code = HTTP_CODE.BAD_CONTENT
      throw error
    } catch (error) {
      return next(error)
    }
  }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (_req, _res, next) => {
    try {
      const error = new Error()
      error.message = 'Asses is denied, max limit for requests, please try again later'
      error.code = HTTP_CODE.BAD_CONTENT
      throw error
    } catch (error) {
      return next(error)
    }
  }
})

module.exports = {
  apiLimiter,
  authLimiter
}
