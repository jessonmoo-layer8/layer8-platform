const CredentialManager = require('./credentialManager');
const BoundaryManager = require('./boundaryManager');

class CrossAppOrchestrator {
  constructor() {
    this.credentialManager = new CredentialManager();
    this.boundaryManager = new BoundaryManager();
  }

  async prepareExecution(plan, userContext) {
    const apps = this.extractAppsFromPlan(plan);
    this.verifyAccess(apps, userContext);
    const credentials = await this.credentialManager.getCredentialsForApps(apps, userContext);
    return this.boundaryManager.enhancePlanWithBoundaries(plan, credentials);
  }

  extractAppsFromPlan(plan) {
    const apps = new Set();
    if (plan.taskMeta && plan.taskMeta.app) {
      apps.add(plan.taskMeta.app);
    }
    if (Array.isArray(plan.apps)) {
      for (const app of plan.apps) apps.add(app);
    }
    if (Array.isArray(plan.steps)) {
      for (const step of plan.steps) {
        if (step.app) apps.add(step.app);
      }
    }
    return Array.from(apps);
  }

  verifyAccess(apps, userContext) {
    const perms = (userContext && userContext.permissions) || [];
    for (const app of apps) {
      const perm = `use_${String(app).toLowerCase()}`;
      if (!perms.includes(perm)) {
        throw new Error(`User lacks access to ${app}`);
      }
    }
  }
}

module.exports = CrossAppOrchestrator;
