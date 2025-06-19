const jwt = require('jsonwebtoken');
jest.mock('axios');

function loadVerifier() {
  jest.resetModules();
  return require('../../backend/api/idp').verifySSOToken;
}

describe('IDP integration', () => {
  it('accepts valid token via default provider', async () => {
    jest.resetAllMocks();
    const verify = loadVerifier();
    const ok = await verify('devtoken');
    expect(ok).toBe(true);
  });

  it('uses Azure adapter when configured', async () => {
    jest.resetAllMocks();
    process.env.IDP_PROVIDER = 'azure';
    const verify = loadVerifier();
    const token = jwt.sign({ iss: 'azure-tenant', exp: Math.floor(Date.now()/1000) + 60 }, 'secret');
    const ok = await verify(token);
    expect(ok).toBe(true);
    delete process.env.IDP_PROVIDER;
  });

  it('uses Okta adapter when configured', async () => {
    jest.resetAllMocks();
    process.env.IDP_PROVIDER = 'okta';
    process.env.OKTA_ISSUER = 'https://okta.example.com/oauth2/default';
    process.env.OKTA_CLIENT_ID = 'abc';
    process.env.OKTA_CLIENT_SECRET = 'def';

    const verify = loadVerifier();
    const axios = require('axios');
    axios.post.mockResolvedValue({ data: { active: true } });
    const ok = await verify('oktatoken');
    expect(ok).toBe(true);

    delete process.env.IDP_PROVIDER;
    delete process.env.OKTA_ISSUER;
    delete process.env.OKTA_CLIENT_ID;
    delete process.env.OKTA_CLIENT_SECRET;
    axios.post.mockReset();
  });
});
