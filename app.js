const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const authRouter = require('./routes/api/auth.router');
const usersRouter = require('./routes/api/users.router');
const imagesRouter = require('./routes/api/images.router');
const testTechRouter = require('./routes/api/test-tech.router');
const testTheoryRouter = require('./routes/api/test-theory.router');

const { HTTP_CODE, DIRS } = require('./utils/constants');
const { apiLimiter, authLimiter } = require('./utils/rateLimits');

const app = express();

app.use(express.static(DIRS.public));

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 }));

app.use('/api', apiLimiter);
app.use('/auth/register', authLimiter);
app.use('/images', apiLimiter);

app.use('/api/test-tech', testTechRouter);
app.use('/api/test-theory', testTheoryRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/images', imagesRouter);

app.use((req, res) => {
  res
    .status(HTTP_CODE.NOT_FOUND)
    .json({ message: ` URL: "${req.url} not found"` });
});

app.use((err, _req, res, _next) => {
  res.status(HTTP_CODE.INTERNAL_SERVER_ERROR).json({ message: err.message });
});

module.exports = app;
