const express = require('express');
const Babysitter = require('../agents/babysitter');
const SmolAgent = require('../agents/smolagent');
const { validateCompliance } = require('../compliance/scorecard');
const { logAudit } = require('../audit/logger');
const { insertTask, getTasks } = require('../db');
const { getAllowedModels, setAllowedModels } = require('../models');
const router = express.Router();

// Submit a new task
router.post('/tasks', async (req, res, next) => {
  try {
    const { task, userContext } = req.body;
    // 1. Multi-agent planning via Hybrid-ACP
    const plan = await SmolAgent.produceFinalPlan(task, userContext);
    // 2. Validate compliance
    const complianceResult = await validateCompliance(plan, userContext);
    // 3. Execute if compliant
    if (complianceResult.compliant) {
      const execResult = await Babysitter.execute(plan, userContext);
      await logAudit('TASK_EXECUTED', { plan, execResult, userContext });
      await insertTask(task, userContext, 'completed', execResult);
      return res.json({ status: 'success', execResult });
    } else {
      await logAudit('COMPLIANCE_BLOCKED', { plan, complianceResult, userContext });
      await insertTask(task, userContext, 'blocked');
      return res.status(403).json({
        status: 'blocked',
        reason: 'Compliance validation failed',
        details: complianceResult,
      });
    }
  } catch (err) {
    next(err);
  }
});

// Get all tasks (stub; you can integrate with your DB/logs)
router.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await getTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// Admin: get allowed AI models
router.get('/admin/models', async (req, res) => {
  const models = await getAllowedModels();
  res.json({ models });
});

// Admin: update allowed AI models
router.post('/admin/models', async (req, res) => {
  const models = Array.isArray(req.body.models)
    ? req.body.models
    : String(req.body.models || '').split(',');
  await setAllowedModels(models.map((m) => m.trim()).filter(Boolean));
  res.json({ status: 'updated', models: await getAllowedModels() });
});

module.exports = router;
