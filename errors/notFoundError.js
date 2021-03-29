const notFoundError = () => {
  const error = new Error()
  error.stack = ''
  error.status = 404
  error.message = 'Your entity is not found'
  throw error
}

module.exports = notFoundError
