// NIST 800-53 plugin
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const NIST_URL = 'https://raw.githubusercontent.com/opencontrol/NIST-800-53-JSON/master/NIST_SP-800-53_rev4.json';
const SAMPLE_PATH = path.join(__dirname, 'nist_sample.json');

async function get_controls() {
  try {
    const res = await axios.get(NIST_URL, { timeout: 10000 });
    if (!res.data.controls) throw new Error('Malformed NIST data');
    return res.data.controls.map((c) => ({
      control_id: c.id,
      description: c.title,
      mappings: c.family,
      updated: c.published || c.updated,
      source: 'NIST 800-53',
      details: c,
    }));
  } catch (err) {
    console.error('[NIST PLUGIN] Failed to fetch controls:', err.message);
    try {
      const fallback = JSON.parse(fs.readFileSync(SAMPLE_PATH, 'utf8'));
      return fallback.controls.map((c) => ({
        control_id: c.id,
        description: c.title,
        mappings: c.family,
        updated: c.published,
        source: 'NIST 800-53',
        details: c,
      }));
    } catch {
      return [];
    }
  }
}

module.exports = { get_controls };
