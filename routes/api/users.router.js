const express = require('express')
const controller = require('../../controllers/users.controller')
const validate = require('../../utils/validation')

const guard = require('../../utils/guard')

const router = express.Router()

router.get('/current', guard, controller.getCurrentUser)
router.patch('/:id', guard, validate.id, validate.updateUser, controller.updateUser)

module.exports = router
