// This is the AI "planner" which produces a step-by-step plan from task intent.
const { generateSemanticPlan } = require('../memory/amem');
const { getAllowedModels } = require('../models');

const Planner = {
  async generatePlan(task, userContext) {
    // In reality, call out to GPT/Claude/etc. via API
    // For this codebase, use semantic memory to produce or retrieve a plan.
    let plan = await generateSemanticPlan(task, userContext);
    const models = getAllowedModels();
    const requested = task.model || models[0];
    if (!models.includes(requested)) {
      throw new Error('Requested model not allowed');
    }
    // Basic example plan selection based on target app
    let adapter = 'playwright';
    if (task.app === 'ServiceNow') adapter = 'servicenow';
    if (task.app === 'Okta') adapter = 'okta';
    if (task.app === 'SAP') adapter = 'sap';

    plan = {
      steps: [
        { action: 'open_browser', adapter },
        { action: 'navigate', url: task.appUrl },
        { action: 'login', username: userContext.username },
        { action: 'reset_password' },
        { action: 'confirm', message: 'Password reset' }
      ],
        adapter,
        taskMeta: { ...task, model: requested },
      };
    return plan;
  }
};

module.exports = Planner;
