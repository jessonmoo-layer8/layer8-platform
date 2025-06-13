// Cache-Augmented Generation (CAG) & Agentic Memory (A-MEM) interface

const memory = {};

function cacheContext(taskId, context) {
  memory[taskId] = context;
}

function getCachedContext(taskId) {
  return memory[taskId];
}

// Example clustering for similar tasks (simulated)
function getRelatedContexts(taskId) {
  // For now, return all cached contexts except the requested one
  return Object.entries(memory)
    .filter(([id, _]) => id !== taskId)
    .map(([_, ctx]) => ctx);
}

module.exports = {
  cacheContext,
  getCachedContext,
  getRelatedContexts,
};
