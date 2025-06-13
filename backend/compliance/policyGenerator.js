const fs = require('fs');
const path = require('path');

function generateOPA(controls, policyPath = path.join(__dirname, 'opa', 'policies.rego')) {
  let rego = 'package layer8.compliance\n\n';
  rego += 'default allow = false\n\n';

  for (const c of controls) {
    rego += `allow {\n    input.taskMeta.control_id == "${c.control_id}"\n}\n\n`;
  }

  fs.writeFileSync(policyPath, rego, 'utf8');
  console.log(`[OPA POLICY GENERATOR] Wrote ${controls.length} rules to ${policyPath}`);
}

module.exports = { generateOPA };
