// Agentic Memory (A-MEM): semantic note storage and retrieval

const { cacheContext, getCachedContext } = require('../compliance/cag-amem');

// Simulated "memory note" store
const semanticNotes = [];

// Store a new memory note
function addMemoryNote(task, userContext, plan) {
  const note = {
    task,
    userContext,
    plan,
    timestamp: new Date().toISOString(),
    keywords: extractKeywords(task),
  };
  semanticNotes.push(note);
  cacheContext(task.id, note); // CAG cache as well
}

// Retrieve most relevant memory note for a given task
async function generateSemanticPlan(task, userContext) {
  // For simplicity: Return the most recent plan for same app, or fallback
  const recent = semanticNotes.find(
    (n) => n.task.app === task.app && n.userContext.role === userContext.role
  );
  return recent ? recent.plan : defaultPlan(task, userContext);
}

function extractKeywords(task) {
  // Simple keyword extraction from task (customize as needed)
  return [task.app, ...(task.actions || [])];
}

function defaultPlan(task, userContext) {
  // Minimal fallback plan
  return {
    steps: [
      { action: 'open_browser', adapter: 'playwright' },
      { action: 'navigate', url: task.appUrl },
      { action: 'login', username: userContext.username },
      { action: 'reset_password' },
      { action: 'confirm', message: 'Password reset' },
    ],
    adapter: 'playwright',
    taskMeta: { ...task },
  };
}

module.exports = {
  addMemoryNote,
  generateSemanticPlan,
  semanticNotes,
};
