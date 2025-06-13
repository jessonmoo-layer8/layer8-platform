// Simulated append-only, tamper-evident blockchain audit log

const crypto = require('crypto');

const blockchain = [];

function appendBlock(event) {
  const prevHash = blockchain.length ? blockchain[blockchain.length - 1].hash : '';
  const block = {
    timestamp: new Date().toISOString(),
    event,
    prevHash,
  };
  const blockData = JSON.stringify(block);
  block.hash = crypto.createHash('sha256').update(blockData).digest('hex');
  blockchain.push(block);
  return block;
}

function getChain() {
  return blockchain;
}

module.exports = { appendBlock, getChain };
