// SAP adapter using REST API
const axios = require('axios');

async function executeWithSAP(plan, userContext) {
  const baseUrl = process.env.SAP_URL;
  const token = process.env.SAP_TOKEN;
  if (!baseUrl || !token) {
    return { status: 'skipped', note: 'SAP integration not configured' };
  }
  try {
    const res = await axios.post(
      `${baseUrl}/api/task`,
      { plan, userContext },
      { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 }
    );
    return res.data;
  } catch (err) {
    console.error('[SAP] API error:', err.message);
    return { status: 'failure', error: err.message };
  }
}

module.exports = { executeWithSAP };
