const testTechModel = require('../model/test-tech.model');
// const { createResponse } = require('../utils/createResponse');
const { HTTP_CODE } = require('../utils/constants');

const getTests = async (_req, res) => {
  try {
    const allTestList = await testTechModel.getAll();

    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: allTestList,
    });
  } catch (error) {
    next(error);
  }
};

const createTests = async (req, res, next) => {
  try {
    const data = await testTechModel.create(req.body);
    return res.status(HTTP_CODE.CREATED).json({
      status: 'success',
      code: HTTP_CODE.CREATED,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const getResult = async (req, res) => {
  try {
    const data = await testTechModel.getAll();

    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTests,
  createTests,
  getResult,
};
