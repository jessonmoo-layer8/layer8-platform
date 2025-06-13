

const axios = require('axios');
const config = require('../config');

async function validateCompliance(plan, userContext) {
  try {
    const res = await axios.post(config.OPA_URL, { input: { ...plan, userContext } });
    const allow = res.data.result && res.data.result.allow;
    const reason = res.data.result && res.data.result.reason;
    return {
      compliant: !!allow,
      details: { score: allow ? 100 : 0, reason: reason || (allow ? 'Compliant' : 'Rejected by policy') }
    };
  } catch (err) {
    console.error('[COMPLIANCE] OPA evaluation failed', err.message);
    // Fallback to minimal checks
    let compliant = false;
    if (plan.taskMeta) {
      if (plan.taskMeta.app === 'Gmail' && userContext.role === 'user') {
        compliant = true;
      } else if (plan.taskMeta.app === 'Active Directory' && userContext.role === 'system_administrator') {
        compliant = true;
      } else if (plan.taskMeta.app === 'PatientPortal' && userContext.role === 'compliance_officer') {
        compliant = true;
      }
    }
    return {
      compliant,
      details: compliant
        ? { score: 100, reason: 'Compliant (fallback)' }
        : { score: 0, reason: 'Non-compliant' }
    };
  }
}

async function enforceCompliance(plan, userContext) {
  // Called by Babysitter AI right before execution for runtime check
  return validateCompliance(plan, userContext);
}

module.exports = {
  validateCompliance,
  enforceCompliance,
};
