module.exports = {
  PORT: process.env.PORT || 4000,
  OPA_URL: process.env.OPA_URL || 'http://localhost:8181/v1/data/layer8/compliance',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  USE_BLOCKCHAIN_AUDIT: true,
  TASK_TIMEOUT: 60 * 1000, // 1 min per task
  USE_LOCAL_LLM: process.env.USE_LOCAL_LLM === 'true',
  API_TOKEN: process.env.API_TOKEN || 'devtoken',
  DB_PATH: process.env.DB_PATH,
  DATABASE_URL: process.env.DATABASE_URL,
  COMPLIANCE_PLUGIN: process.env.COMPLIANCE_PLUGIN || 'nist',
  ALLOWED_MODELS: (process.env.ALLOWED_MODELS || 'gpt-4o,claude-3-opus').split(',').map(m => m.trim()).filter(Boolean),
  MODELS_FILE: process.env.MODELS_FILE || require('path').join(__dirname, 'models.json'),
  IDP_INTROSPECTION_URL: process.env.IDP_INTROSPECTION_URL,
  IDP_CLIENT_ID: process.env.IDP_CLIENT_ID,
  IDP_CLIENT_SECRET: process.env.IDP_CLIENT_SECRET,
};
