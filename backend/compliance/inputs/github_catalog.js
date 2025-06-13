// Fetch regulatory documents from a public GitHub repo
const axios = require('axios');
const GITHUB_API = 'https://api.github.com/repos/open-regulations/regulations-data/contents';

async function get_controls() {
  try {
    const res = await axios.get(GITHUB_API, { timeout: 10000 });
    return res.data.map(file => ({
      control_id: file.name,
      description: 'See file: ' + file.path,
      mappings: 'GitHub OpenRegulations',
      updated: file.git_url,
      source: 'GitHub Catalog',
      details: file
    }));
  } catch (err) {
    console.error('[GITHUB PLUGIN] Failed to fetch controls:', err.message);
    return [];
  }
}

module.exports = { get_controls };
