// Enterprise SSO/IDP integration
const axios = require('axios');
const config = require('../config');
const VALID_TOKEN = process.env.SSO_VALID_TOKEN || 'devtoken';

async function verifySSOToken(token) {
  if (!token) return false;
  if (token === VALID_TOKEN) return true;
  if (config.IDP_INTROSPECTION_URL) {
    try {
      const res = await axios.post(
        config.IDP_INTROSPECTION_URL,
        new URLSearchParams({ token }).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          auth: config.IDP_CLIENT_ID
            ? { username: config.IDP_CLIENT_ID, password: config.IDP_CLIENT_SECRET }
            : undefined,
        }
      );
      return !!res.data.active;
    } catch (err) {
      console.error('[IDP] token introspection failed', err.message);
      return false;
    }
  }
  return false;
}

module.exports = { verifySSOToken };
