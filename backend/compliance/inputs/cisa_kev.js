// CISA KEV plugin - Known Exploited Vulnerabilities catalog
const axios = require('axios');
const CISA_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';

async function get_controls() {
  try {
    const res = await axios.get(CISA_URL, { timeout: 10000 });
    const vulnerabilities = res.data.vulnerabilities || [];
    return vulnerabilities.map(v => ({
      control_id: v.cveID,
      description: v.vulnerabilityName,
      mappings: v.vendorProject + ' ' + v.product,
      updated: v.dateAdded,
      source: 'CISA KEV',
      details: v
    }));
  } catch (err) {
    console.error('[CISA KEV PLUGIN] Failed to fetch vulnerabilities:', err.message);
    return [];
  }
}

module.exports = { get_controls };
