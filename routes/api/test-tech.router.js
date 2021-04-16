const express = require('express');
const router = express.Router();
const controller = require('../../controllers/test-tech.controller');
const validate = require('../../utils/validation');
const { guard } = require('../../utils/guard');

router
  .get('/', guard, controller.getTests)
  .post('/', guard, controller.createTests);

router.post('/result', guard, validate.checkResults, controller.getResult);

module.exports = router;
