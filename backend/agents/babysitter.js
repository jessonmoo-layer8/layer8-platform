const { enforceCompliance } = require('../compliance/scorecard');
const { executeWithPlaywright } = require('./adapters/playwright');
const { executeWithSelenium } = require('./adapters/selenium');
const { executeWithServiceNow } = require('./adapters/servicenow');
const { executeWithOkta } = require('./adapters/okta');
const { executeWithSAP } = require('./adapters/sap');
const config = require('../config');

let localLLMRefinePlan = null;
if (config.USE_LOCAL_LLM) {
  ({ localLLMRefinePlan } = require('./plugins/localLLM'));
}

const Babysitter = {
  async execute(plan, userContext) {
    // 1. Optionally refine plan with local LLM
    let executionPlan = plan;
    if (config.USE_LOCAL_LLM && localLLMRefinePlan) {
      executionPlan = await localLLMRefinePlan(plan, userContext);
    }

    // 2. Enforce compliance at execution time
    const compliance = await enforceCompliance(executionPlan, userContext);
    if (!compliance.compliant) {
      throw new Error('Task not compliant at execution');
    }

    // 3. Choose appropriate adapter based on plan
    let execResult;
    switch (executionPlan.adapter) {
      case 'playwright':
        execResult = await executeWithPlaywright(executionPlan, userContext);
        break;
      case 'selenium':
        execResult = await executeWithSelenium(executionPlan, userContext);
        break;
      case 'servicenow':
        execResult = await executeWithServiceNow(executionPlan, userContext);
        break;
      case 'okta':
        execResult = await executeWithOkta(executionPlan, userContext);
        break;
      case 'sap':
        execResult = await executeWithSAP(executionPlan, userContext);
        break;
      default:
        throw new Error(`Unknown adapter: ${executionPlan.adapter}`);
    }

    return {
      result: execResult,
      compliance,
      timestamp: new Date().toISOString(),
      usedLocalLLM: !!config.USE_LOCAL_LLM,
    };
  },
};

module.exports = Babysitter;
