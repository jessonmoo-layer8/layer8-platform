// Okta adapter using API calls
const axios = require('axios');

async function executeWithOkta(plan, userContext) {
  const baseUrl = process.env.OKTA_URL;
  const token = process.env.OKTA_TOKEN;
  if (!baseUrl || !token) {
    return { status: 'skipped', note: 'Okta integration not configured' };
  }
  try {
    const res = await axios.post(
      `${baseUrl}/api/v1/hooks/execute`,
      { plan, user: userContext.username },
      { headers: { Authorization: `SSWS ${token}` }, timeout: 5000 }
    );
    return res.data;
  } catch (err) {
    console.error('[Okta] API error:', err.message);
    return { status: 'failure', error: err.message };
  }
}

module.exports = { executeWithOkta };
