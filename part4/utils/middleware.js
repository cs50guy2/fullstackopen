const logger = require('./logger');
const morgan = require('morgan');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


morgan.token('blog', function (req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    response.status(400).send({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    response.status(401).send({ error: 'token is invalid or missing' });
  }
  // next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')){
    request.token = authorization.substring(7);
  }
  next();
};
const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  const user = await User.findById(decodedToken.id);
  if (user) {
    request.user = user;
  } else {
    return response.status(404).json({ error: 'user not found' });
  }
  next();
};

module.exports = {
  morgan,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
};
