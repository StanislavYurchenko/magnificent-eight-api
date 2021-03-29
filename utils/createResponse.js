const { HTTP_CODE } = require('./constants')

const createResponse = (res, data, error, code) => {
  // eslint-disable-next-line no-mixed-operators
  const codeRes = code || error && error.code || !data && HTTP_CODE.NOT_FOUND || data && HTTP_CODE.OK
  const status = data ? 'success' : 'invalid'

  return res
    .status(codeRes)
    .json({
      status,
      code: codeRes,
      data: (data || error),
    })
}

module.exports = {
  createResponse,
}
