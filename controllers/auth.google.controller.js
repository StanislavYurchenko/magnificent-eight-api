const queryString = require('query-string');
const axios = require('axios');
require('dotenv').config();

const { dobleTokensCreater } = require('../utils/tokensCreater');
const usersModel = require('../model/users');
const User = require('../model/schemas/User');

const {
  NODE_ENV,
  DB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  API_URL,
  API_URL_LOCAL,
  APP_URL,
  APP_URL_LOCAL,
} = process.env;

const BACK_URL = NODE_ENV === 'development' ? API_URL_LOCAL : API_URL;
const FRONT_URL = NODE_ENV === 'development' ? APP_URL_LOCAL : APP_URL;

const googleAuth = async (_req, res, next) => {
  try {
    const stringifiedParams = queryString.stringify({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${BACK_URL}/auth/google-redirect`,
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
        redirect_uri: `${BACK_URL}/auth/google-redirect`,
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
    const {
      role,
      accessToken,
      refreshToken,
      expires_on,
    } = await checkRegisterAndLogin({ name, email }, next);

    return res.redirect(
      `${FRONT_URL}/google?name=${name}&role=${role}&accessToken=${accessToken}&refreshToken=${refreshToken}&expires_on=${expires_on}`,
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

    const { accessToken, refreshToken, expires_on } = dobleTokensCreater(
      user.data,
    );

    await usersModel.updateToken(user.data._id, {
      accessToken,
      refreshToken,
    });

    return {
      role: user.data.role,
      accessToken,
      refreshToken,
      expires_on,
    };
  } catch (error) {
    next(error);
  }
};

module.exports = { googleAuth, googleRedirect };
