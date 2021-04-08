const queryString = require('query-string');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const emailConfig = require('../config/emailConfig.json');
const usersModel = require('../model/users');
const User = require('../model/schemas/User');
const { HTTP_CODE } = require('../utils/constants');
const {
  JWT_SECRET,
  NODE_ENV,
  DB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = process.env;

const BASE_URL =
  NODE_ENV === 'development' ? emailConfig.dev : emailConfig.prod;

const googleAuth = async (_req, res, next) => {
  try {
    const stringifiedParams = queryString.stringify({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${BASE_URL}/auth/google-redirect`,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });
    return res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
    );
  } catch (error) {
    next(error);
  }
};

const googleRedirect = async (req, res, next) => {
  try {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);
    const code = urlParams.code;

    const tokenData = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${BASE_URL}/auth/google-redirect`,
        grant_type: 'authorization_code',
        code,
      },
    });
    const userData = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${tokenData.data.access_token}`,
      },
    });

    const { name, email } = userData.data;
    const token = await checkRegisterAndLogin({ name, email }, next);

    return res.redirect(
      `${BASE_URL}/auth/google-login?name=${name}&token=${token}`,
    );
  } catch (error) {
    next(error);
  }
};

const checkRegisterAndLogin = async (body, next) => {
  const { name, email } = body;
  try {
    let user = await usersModel.findUserByEmail(email);
    if (!user.data) {
      const newUser = new User({
        name,
        email,
        password: DB_CLIENT_SECRET,
        verifyToken: null,
        onlyGoogleRegister: true,
      });
      await newUser.save();
      user = await usersModel.findUserByEmail(email);
    }

    const payload = { _id: user.data._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '240h' });
    await usersModel.updateToken(user.data._id, token);
    return token;
  } catch (error) {
    next(error);
  }
};

const googleLogin = (req, res, _next) => {
  const { name, token } = req.query;

  return res.status(HTTP_CODE.OK).json({
    status: 'success',
    code: HTTP_CODE.OK,
    data: {
      name,
      token,
    },
  });
};

module.exports = { googleAuth, googleRedirect, googleLogin };
