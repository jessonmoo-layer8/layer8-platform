// Simple in-memory cache for CAG/A-MEM

const cache = {};

function set(key, value) {
  cache[key] = value;
}

function get(key) {
  return cache[key];
}

function del(key) {
  delete cache[key];
}

function clear() {
  Object.keys(cache).forEach((key) => delete cache[key]);
}

module.exports = { set, get, del, clear };
