const axios = require('axios');

async function get_controls() {
  const baseUrl = process.env.ONETRUST_URL;
  const token = process.env.ONETRUST_TOKEN;
  if (!baseUrl || !token) return [];
  try {
    const res = await axios.get(`${baseUrl}/controls`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000,
    });
    const controls = res.data.controls || [];
    return controls.map((c) => ({
      control_id: c.id || c.control_id,
      description: c.title || c.description,
      mappings: c.family || c.category,
      updated: c.updated || c.modified,
      source: 'OneTrust',
      details: c,
    }));
  } catch (err) {
    console.error('[ONETRUST PLUGIN] Failed to fetch controls:', err.message);
    return [];
  }
}

module.exports = { get_controls };
