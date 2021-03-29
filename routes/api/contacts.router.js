const express = require('express')
const controller = require('../../controllers/contacts.controller')
const validate = require('../../utils/validation')
const guard = require('../../utils/guard')

const router = express.Router()

router.get('/', guard, validate.getContactsQuery, controller.getContacts)

router.get('/:id', guard, validate.id, controller.getContactById)

router.post('/', guard, validate.newContact, controller.addContact)

router.delete('/:id', guard, validate.id, controller.removeContactById)

router.patch('/:id', guard, validate.id, validate.updateContact, controller.updateContactById)

module.exports = router
