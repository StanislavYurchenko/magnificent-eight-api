require('dotenv').config();

const { APP_URL} = process.env;

const usersModel = require('../model/users');
const {
  dobleTokensCreater,
  accessTokenCreater,
} = require('../utils/tokensCreater');
const { createResponse } = require('../utils/createResponse');
const { HTTP_CODE } = require('../utils/constants');

const hello = (_req, res) => {
  return createResponse(
    res,
    { message: 'Server is waiting for your request' },
    null,
    HTTP_CODE.OK,
  );
};

const register = async (req, res) => {
  const { data, error } = await usersModel.register(req.body);
  const code = data ? HTTP_CODE.CREATED : HTTP_CODE.CONFLICT;

  return createResponse(res, data?.name, error, code);
};

const login = async (req, res) => {
  const { data, error } = await usersModel.login(req.body);
  const code = data ? HTTP_CODE.OK : HTTP_CODE.NOT_FOUND;

  if (error) {
    return createResponse(res, data, error, code);
  }

  const { accessToken, refreshToken, expires_on } = dobleTokensCreater(data);

  await usersModel.updateToken(data._id, {
    accessToken,
    refreshToken,
  });

  const user = {
    avatar: data.avatar,
    name: data.name,
    role: data.role,
    token: {
      accessToken,
      refreshToken,
      expires_on,
    },
  };

  return createResponse(res, user, error, code);
};

const logout = async (req, res) => {
  const { data, error } = await usersModel.logout(req.user.id);

  const logoutResult = data && { data: { message: 'Logout success' } };

  return createResponse(res, logoutResult, error);
};

const verify = async (req, res) => {
  const { data, error } = await usersModel.findByVerifyToken(req.params.token);
  const code = data ? HTTP_CODE.OK : HTTP_CODE.NOT_FOUND;

  const result = data
    ? { message: 'Verification successful' }
    : { message: 'Link is not valid' };

  if (error) {
    return createResponse(res, data, error, code);
  }
  await usersModel.updateVerifyToken(data._id, true, null);

  // return createResponse(res, result, error, code);
  return res.redirect(`${APP_URL}`);
};

const refreshToken = async (req, res, next) => {
  console.log(req.body.refreshToken);
  try {
    const { data, error } = await usersModel.findUserByRefreshToken(
      req.body.refreshToken,
    );

    const code = data ? HTTP_CODE.OK : HTTP_CODE.NOT_FOUND;
    if (!data || error) {
      return createResponse(res, data, error, code);
    }

    const { accessToken, expires_on } = accessTokenCreater(data);

    await usersModel.updateAccessToken(data._id, accessToken);

    const user = {
      avatar: data.avatar,
      name: data.name,
      token: {
        accessToken,
        expires_on,
      },
    };

    return createResponse(res, user, error, code);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  verify,
  hello,
  refreshToken,
};
