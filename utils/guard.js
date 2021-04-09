const passport = require('passport');
require('../config/passport');
const { HTTP_CODE } = require('./constants');

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const token = req.get('Authorization')?.split(' ')[1];    

    if (!user || err || token !== user.token) {
      console.log('We are here', token);

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

module.exports = guard;
