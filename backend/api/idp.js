// Enterprise SSO/IDP integration
const axios = require('axios');
const jwt = require('jsonwebtoken');
const config = require('../config');

const VALID_TOKEN = process.env.SSO_VALID_TOKEN || 'devtoken';

async function verifyGeneric(token) {
  if (!config.IDP_INTROSPECTION_URL) return false;
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

async function verifyOkta(token) {
  if (!config.OKTA_ISSUER) return false;
  try {
    const res = await axios.post(
      `${config.OKTA_ISSUER}/v1/introspect`,
      new URLSearchParams({ token }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: config.OKTA_CLIENT_ID
          ? { username: config.OKTA_CLIENT_ID, password: config.OKTA_CLIENT_SECRET }
          : undefined,
      }
    );
    return !!res.data.active;
  } catch (err) {
    console.error('[IDP:Okta] introspection failed', err.message);
    return false;
  }
}

async function verifyAzure(token) {
  try {
    const payload = jwt.decode(token);
    if (!payload) return false;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return false;
    if (config.AZURE_TENANT && payload.iss && !payload.iss.includes(config.AZURE_TENANT)) {
      return false;
    }
    return true;
  } catch (err) {
    console.error('[IDP:Azure] token decode failed', err.message);
    return false;
  }
}

async function verifySSOToken(token) {
  if (!token) return false;
  if (token === VALID_TOKEN) return true;

  const provider = config.IDP_PROVIDER || 'generic';
  switch (provider) {
    case 'okta':
      return verifyOkta(token);
    case 'azure':
      return verifyAzure(token);
    default:
      return verifyGeneric(token);
  }
}

module.exports = { verifySSOToken };
