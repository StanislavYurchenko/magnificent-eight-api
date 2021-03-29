const express = require('express')

const controller = require('../../controllers/images.controller')
const validate = require('../../utils/validation')
const guard = require('../../utils/guard')
const upload = require('../../utils/upload')

const router = express.Router()

router.patch(
  '/',
  [
    guard,
    upload.single('image'),
    validate.uploadImage,
  ],
  controller.uploadImage
)

module.exports = router
