const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { TOKEN } = require('./constants');

const dobleTokensCreater = data => {
  const payloadAccess = { _id: data._id, type: TOKEN.ACCESS.TYPE };
  const payloadRefresh = { _id: data._id, type: TOKEN.REFRESH.TYPE };
  const accessToken = jwt.sign(payloadAccess, JWT_SECRET, {
    expiresIn: TOKEN.ACCESS.EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payloadRefresh, JWT_SECRET, {
    expiresIn: TOKEN.REFRESH.EXPIRES_IN,
  });
  const expires_on = Date.now() + parseInt(TOKEN.ACCESS.EXPIRES_IN) * 60 * 1000;

  return { accessToken, refreshToken, expires_on };
};

const accessTokenCreater = data => {
  const payloadAccess = { _id: data._id, type: TOKEN.ACCESS.TYPE };
  const accessToken = jwt.sign(payloadAccess, JWT_SECRET, {
    expiresIn: TOKEN.ACCESS.EXPIRES_IN,
  });
  const expires_on = Date.now() + parseInt(TOKEN.ACCESS.EXPIRES_IN) * 60 * 1000;

  return { accessToken, expires_on };
};

module.exports = { dobleTokensCreater, accessTokenCreater };
