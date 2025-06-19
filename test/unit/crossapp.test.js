jest.mock('node-vault', () => {
  return () => ({ read: jest.fn().mockResolvedValue({ data: { data: { token: 'vaultsecret' } } }) });
});

function getOrchestrator() {
  jest.resetModules();
  return require('../../backend/orchestration/crossapp');
}

describe('CrossAppOrchestrator', () => {
  it('throws if user lacks permission for app', async () => {
    const CrossAppOrchestrator = getOrchestrator();
    const orch = new CrossAppOrchestrator();
    const plan = { taskMeta: { app: 'jira' } };
    const user = { permissions: [] };
    await expect(orch.prepareExecution(plan, user)).rejects.toThrow('jira');
  });

  it('adds credentials from env', async () => {
    process.env.APP_JIRA_TOKEN = 'secret';
    const CrossAppOrchestrator = getOrchestrator();
    const orch = new CrossAppOrchestrator();
    const plan = { taskMeta: { app: 'jira' } };
    const user = { permissions: ['use_jira'] };
    const enhanced = await orch.prepareExecution(plan, user);
    expect(enhanced.credentials.jira.token).toBe('secret');
    delete process.env.APP_JIRA_TOKEN;
  });

  it('pulls credentials from Vault when configured', async () => {
    process.env.VAULT_ADDR = 'https://vault.example.com';
    process.env.VAULT_TOKEN = 'root';
    const CrossAppOrchestrator = getOrchestrator();
    const orch = new CrossAppOrchestrator();
    const plan = { taskMeta: { app: 'jira' } };
    const user = { permissions: ['use_jira'] };
    const enhanced = await orch.prepareExecution(plan, user);
    expect(enhanced.credentials.jira.token).toBe('vaultsecret');
    delete process.env.VAULT_ADDR;
    delete process.env.VAULT_TOKEN;
  });
});
