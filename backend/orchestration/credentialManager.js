let VaultClient = null;
if (process.env.VAULT_ADDR && process.env.VAULT_TOKEN) {
  try {
    const vault = require('node-vault');
    VaultClient = vault({ endpoint: process.env.VAULT_ADDR, token: process.env.VAULT_TOKEN });
  } catch (err) {
    console.error('[Vault] init failed', err.message);
  }
}

class CredentialManager {
  constructor() {
    this.vault = VaultClient;
  }

  async getCredentialsForApps(apps, userContext) {
    const creds = {};
    for (const app of apps) {
      if (this.vault) {
        try {
          const result = await this.vault.read(`secret/data/${app}`);
          if (result && result.data && result.data.data) {
            creds[app] = result.data.data;
            continue;
          }
        } catch (err) {
          console.error(`[Vault] read ${app} failed`, err.message);
        }
      }
      const envVar = `APP_${app.toUpperCase()}_TOKEN`;
      if (process.env[envVar]) {
        creds[app] = { token: process.env[envVar] };
      }
    }
    return creds;
  }
}

module.exports = CredentialManager;
