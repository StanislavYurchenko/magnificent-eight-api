const express = require('express');
const router = express.Router();
const controller = require('../../controllers/test-tech.controller');
// const validate = require('../../utils/validation');
// const guard = require('../../utils/guard');

router.get('/', controller.getTests).post('/', controller.createTests);

router.get('/result', controller.getResult);

module.exports = router;
