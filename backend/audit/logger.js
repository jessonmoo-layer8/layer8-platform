const { appendBlock } = require('./blockchain');

async function logAudit(eventType, details) {
  // Write to blockchain log (and can log to DB, SIEM, etc. as needed)
  appendBlock({ eventType, details });
  // Also log to console for visibility
  console.log(`[AUDIT] ${eventType}`, details);
}

module.exports = { logAudit };
