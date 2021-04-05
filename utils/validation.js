const Joi = require('joi');
const mongoose = require('mongoose');
const { HTTP_CODE, SUBSCRIPTIONS_TYPE } = require('./constants');

const id = (req, _res, next) => {
  const { id } = req.params;
  const isIdValid = mongoose.Types.ObjectId.isValid(id);
  try {
    if (!isIdValid) {
      const error = new Error();
      error.message = 'Id is invalid';
      error.code = HTTP_CODE.BAD_CONTENT;
      throw error;
    }
  } catch (error) {
    next(error);
  }
  next();
};

const auth = (req, _res, next) => {
  const { body } = req;
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const validationResult = schema.validate(body);

  try {
    if (validationResult.error) {
      const error = new Error();
      error.message = validationResult.error.message;
      error.code = HTTP_CODE.BAD_CONTENT;
      throw error;
    }
  } catch (error) {
    next(error);
  }

  next();
};

const newUser = (req, _res, next) => {
  const { body } = req;
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    subscription: Joi.string()
      .valid(...Object.values(SUBSCRIPTIONS_TYPE))
      .default(SUBSCRIPTIONS_TYPE.free),
  });
  const validationResult = schema.validate(body);

  try {
    if (validationResult.error) {
      const error = new Error();
      error.message = validationResult.error.message;
      error.code = HTTP_CODE.BAD_CONTENT;
      throw error;
    }
  } catch (error) {
    next(error);
  }

  next();
};

const updateUser = (req, _res, next) => {
  const { body } = req;
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    subscription: Joi.string().valid(...Object.values(SUBSCRIPTIONS_TYPE)),
    password: Joi.string(),
  });
  const validationResult = schema.validate(body);

  try {
    if (validationResult.error) {
      const error = new Error();
      error.message = validationResult.error.message;
      error.code = HTTP_CODE.BAD_CONTENT;
      throw error;
    }
  } catch (error) {
    next(error);
  }

  next();
};

const uploadImage = (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error();
      error.message = 'Field of avatar with file not found';
      error.code = HTTP_CODE.BAD_CONTENT;
      throw error;
    }
  } catch (error) {
    next(error);
  }

  next();
};

const checkResults = (req, _res, next) => {
  const { body } = req;
  const schema = Joi.array()
    .items(
      Joi.object({
        questionId: Joi.number().required(),
        answer: Joi.alternatives().try(Joi.string(), null).required(),
      }),
    )
    .required();
  const validationResult = schema.validate(body);

  try {
    if (validationResult.error) {
      const error = new Error();
      error.message = validationResult.error.message;
      error.code = HTTP_CODE.BAD_CONTENT;
      throw error;
    }
  } catch (error) {
    next(error);
  }

  next();
};

module.exports = {
  id,
  auth,
  newUser,
  updateUser,
  uploadImage,
  checkResults,
};
