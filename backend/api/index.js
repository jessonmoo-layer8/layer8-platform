const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const middleware = require('./middleware');
const { authenticate } = require('./auth');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const pino = require('pino');
const pinoHttp = require('express-pino-logger');
const { client, requestCounter } = require('../metrics');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const app = express();
app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));
app.use(bodyParser.json());
app.use(middleware.requestLogger);
app.use(authenticate);
app.use('/api', routes);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Global error handler
app.use(middleware.errorLogger);
app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Layer 8 API running on port ${PORT}`);
  });
}

module.exports = app;
