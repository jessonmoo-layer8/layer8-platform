class BoundaryManager {
  enhancePlanWithBoundaries(plan, credentials) {
    const allowedApps = Object.keys(credentials);
    const steps = Array.isArray(plan.steps)
      ? plan.steps.map((s) => ({ ...s, allowedApps }))
      : plan.steps;
    return { ...plan, steps, credentials };
  }
}

module.exports = BoundaryManager;
