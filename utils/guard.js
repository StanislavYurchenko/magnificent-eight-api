const passport = require('passport');
require('../config/passport');
const { HTTP_CODE, ROLE } = require('./constants');

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const token = req.get('Authorization')?.split(' ')[1];

    if (!user || err || token !== user.token.accessToken) {
      return res.status(HTTP_CODE.FORBIDDEN).json({
        status: 'error',
        code: HTTP_CODE.FORBIDDEN,
        data: 'Forbidden',
        message: 'Access is denied',
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

const adminGuard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const token = req.get('Authorization')?.split(' ')[1];

    if (
      !user ||
      err ||
      token !== user.token.accessToken ||
      user.role !== ROLE.ADMIN
    ) {
      return res.status(HTTP_CODE.FORBIDDEN).json({
        status: 'error',
        code: HTTP_CODE.FORBIDDEN,
        data: 'Forbidden',
        message: 'Access is denied',
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = { guard, adminGuard };
