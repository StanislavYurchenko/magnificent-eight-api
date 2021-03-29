const express = require('express')
const controller = require('../../controllers/auth.controller')
const validate = require('../../utils/validation')
const guard = require('../../utils/guard')

const router = express.Router()

router.post('/register', validate.auth, validate.newUser, controller.register)

router.post('/login', validate.auth, controller.login)

router.post('/logout', guard, controller.logout)

router.get('/verify/:token', controller.verify)

module.exports = router
