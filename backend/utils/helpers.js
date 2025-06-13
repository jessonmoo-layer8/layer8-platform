// Example: Mask sensitive data in logs
function maskSensitive(data) {
  if (!data) return data;
  const clone = { ...data };
  if (clone.password) clone.password = '********';
  if (clone.token) clone.token = '****';
  return clone;
}

// Generate a random UUID (v4)
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

module.exports = {
  maskSensitive,
  uuidv4,
};
