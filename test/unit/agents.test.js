const Babysitter = require('../../backend/agents/babysitter');

describe('Babysitter Agent', () => {
  it('should throw error if not compliant', async () => {
    const plan = { adapter: 'playwright', taskMeta: { app: 'Gmail' } };
    const userContext = { role: 'guest' };
    await expect(Babysitter.execute(plan, userContext)).rejects.toThrow();
  });
});
