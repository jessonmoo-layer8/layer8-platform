const { requestCounter } = require('../metrics');

const requestLogger = (req, res, next) => {
  res.on('finish', () => {
    requestCounter.labels(req.path, req.method, res.statusCode).inc();
  });
  next();
};

const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

module.exports = {
  requestLogger,
  errorLogger: (err, req, res, next) => {
    logger.error({ err }, 'REQUEST ERROR');
    next(err);
  },
};
