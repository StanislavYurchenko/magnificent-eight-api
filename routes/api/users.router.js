const express = require('express');
const controller = require('../../controllers/users.controller');
const validate = require('../../utils/validation');

const { guard, adminGuard } = require('../../utils/guard');

const router = express.Router();

router.get('/current', guard, controller.getCurrentUser);
router.get('/all/:role', adminGuard, controller.getAll);

router
  .patch(
    '/update/:email',
    adminGuard,
    validate.updateUser,
    controller.updateUser,
  )
  .delete('/delete/:email', adminGuard, controller.deleteUser);

module.exports = router;
