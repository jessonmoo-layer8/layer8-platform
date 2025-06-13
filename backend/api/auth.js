const config = require('../config');
const { verifySSOToken } = require('./idp');

function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (config.API_TOKEN && token === config.API_TOKEN) {
    return next();
  }
  verifySSOToken(token)
    .then((valid) => {
      if (valid) return next();
      res.status(401).json({ error: 'Unauthorized' });
    })
    .catch(() => res.status(401).json({ error: 'Unauthorized' }));
}

module.exports = { authenticate };
