const { validateCompliance } = require('../../backend/compliance/scorecard');

describe('Compliance Integration', () => {
  it('should validate compliant Gmail task', async () => {
    const plan = { taskMeta: { app: 'Gmail' } };
    const userContext = { role: 'user' };
    const result = await validateCompliance(plan, userContext);
    expect(result.compliant).toBe(true);
  });

  it('should validate compliant Active Directory task', async () => {
    const plan = { taskMeta: { app: 'Active Directory' } };
    const userContext = { role: 'system_administrator' };
    const result = await validateCompliance(plan, userContext);
    expect(result.compliant).toBe(true);
  });

  it('should block non-compliant Gmail task', async () => {
    const plan = { taskMeta: { app: 'Gmail' } };
    const userContext = { role: 'guest' };
    const result = await validateCompliance(plan, userContext);
    expect(result.compliant).toBe(false);
  });
});
