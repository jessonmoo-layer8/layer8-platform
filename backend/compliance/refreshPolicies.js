const plugin = require('./inputs');
const { generateOPA } = require('./policyGenerator');

async function refreshPolicies() {
  const controls = await plugin.get_controls();
  if (!controls.length) {
    console.warn('[REFRESH POLICIES] No controls fetched!');
    return;
  }
  generateOPA(controls);
}

if (require.main === module) {
  refreshPolicies();
}

module.exports = { refreshPolicies };
