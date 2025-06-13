const { maskSensitive, uuidv4 } = require('../../backend/utils/helpers');

describe('Helpers', () => {
  it('should mask sensitive data', () => {
    const data = { username: 'a', password: 'b', token: 'c' };
    const masked = maskSensitive(data);
    expect(masked.password).toBe('********');
    expect(masked.token).toBe('****');
  });

  it('should generate a valid UUID', () => {
    const id = uuidv4();
    expect(id).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/);
  });
});
