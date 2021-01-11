const logger = require('./logger')

const errorHandler = (error, _request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({
      error: 'malformatted id',
    })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message,
    })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    })
  }

  next(error)
}

const tokenExtractor = (request, _response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }

  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
}
