const client = require('prom-client');
const requestCounter = new client.Counter({
  name: 'layer8_api_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['route', 'method', 'status']
});
client.collectDefaultMetrics();
module.exports = { client, requestCounter };
