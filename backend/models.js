const fs = require('fs');
const path = require('path');
const config = require('./config');

function loadFromFile() {
  try {
    const data = fs.readFileSync(config.MODELS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

function saveToFile(models) {
  try {
    fs.writeFileSync(config.MODELS_FILE, JSON.stringify(models, null, 2));
  } catch (e) {
    console.error('[MODELS] Failed to write models file', e.message);
  }
}

let models = loadFromFile() || config.ALLOWED_MODELS;

function getAllowedModels() {
  return models;
}

function setAllowedModels(newModels) {
  models = newModels.filter(Boolean);
  saveToFile(models);
}

module.exports = { getAllowedModels, setAllowedModels };
