// backend/agents/smolagent.js
// Hybrid-ACP planning layer - generates a final plan using multiple LLMs

const { generatePlanWithLLMs } = require('./multiagent-coord');

async function produceFinalPlan(task, userContext) {
  const proposals = await generatePlanWithLLMs(task, userContext);
  const bestPlan = proposals[0];
  // Attach task metadata so compliance checks can evaluate
  bestPlan.taskMeta = { ...task };
  return bestPlan;
}

module.exports = { produceFinalPlan };
