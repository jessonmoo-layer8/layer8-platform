const plugin = require('../nist');

describe('NIST plugin', () => {
  it('returns an array of controls', async () => {
    const controls = await plugin.get_controls();
    expect(Array.isArray(controls)).toBe(true);
  });
});
