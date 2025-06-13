// Loader for compliance input plugins
const config = require('../../config');

let plugin;
switch (config.COMPLIANCE_PLUGIN) {
  case 'onetrust':
    plugin = require('./onetrust');
    break;
  case 'ucf':
    plugin = require('./ucf');
    break;
  case 'cisa_kev':
    plugin = require('./cisa_kev');
    break;
  case 'github':
    plugin = require('./github_catalog');
    break;
  case 'nist':
  default:
    plugin = require('./nist');
}

module.exports = plugin;
