const testTheoryModel = require('../model/test-theory.model');
const { HTTP_CODE } = require('../utils/constants');
const { getTwelveTests, countResult } = require('../utils/dbHandler');

const getTests = async (_req, res) => {
  try {
    const allTestsList = await testTheoryModel.getAll();

    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: getTwelveTests(allTestsList),
    });
  } catch (error) {
    next(error);
  }
};

const createTests = async (req, res, next) => {
  try {
    const data = await testTheoryModel.create(req.body);
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
    const allTestsList = await testTheoryModel.getAll();
    const answers = req.body;

    return res.status(HTTP_CODE.OK).json({
      status: 'success',
      code: HTTP_CODE.OK,
      data: countResult(answers, allTestsList),
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
