const express = require('express');
const router = express.Router();
const controller = require('../../controllers/test-tech.controller');
// const validate = require('../../utils/validation');
const guard = require('../../utils/guard');

router.get('/', controller.getTests).post('/', guard, controller.createTests);

router.get('/result', guard, controller.getResult);

module.exports = router;
