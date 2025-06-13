// ServiceNow adapter using REST API
const axios = require('axios');

async function executeWithServiceNow(plan, userContext) {
  const baseUrl = process.env.SERVICENOW_URL;
  const token = process.env.SERVICENOW_TOKEN;
  if (!baseUrl || !token) {
    return { status: 'skipped', note: 'ServiceNow integration not configured' };
  }
  try {
    const res = await axios.post(
      `${baseUrl}/api/tasks`,
      { plan, userContext },
      { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 }
    );
    return res.data;
  } catch (err) {
    console.error('[ServiceNow] API error:', err.message);
    return { status: 'failure', error: err.message };
  }
}

module.exports = { executeWithServiceNow };
