const express = require('express');
const controller = require('../../controllers/auth.controller');
const googleContoller = require('../../controllers/auth.google.controller');
const validate = require('../../utils/validation');
const guard = require('../../utils/guard');

const router = express.Router();

router.get('/', controller.hello);

router.post('/register', validate.newUser, controller.register);

router.post('/login', validate.auth, controller.login);

router.post('/logout', guard, controller.logout);

router.get('/verify/:token', controller.verify);

router.get('/google', googleContoller.googleAuth);

router.get('/google-redirect', googleContoller.googleRedirect);

module.exports = router;
