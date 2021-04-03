const testModel = require('../model/test-tech.model');
const { createResponse } = require('../utils/createResponse');
const { HTTP_CODE } = require('../utils/constants');

const getTests = async (_req, res) => {
  const { data, error } = await testModel.getAll();

  const code = data ? HTTP_CODE.OK : HTTP_CODE.BAD_CONTENT;

  return createResponse(res, data, error, code);
};

const createTests = async (req, res) => {
  const { data, error } = await testModel.create(req.body);

  const code = data ? HTTP_CODE.OK : HTTP_CODE.BAD_CONTENT;

  return createResponse(res, data, error, code);
};

module.exports = {
  getTests,
  createTests,
};
