# Layer 8 Onboarding Guide

Welcome to Layer 8! This guide will help you and your team set up, test, and manage the platform.

## Steps

1. Clone the repository and review the `README.md`.
2. Install dependencies (Node.js, Docker, Kubernetes as needed).
3. Configure your environment variables and secrets.
   - `API_TOKEN` for authenticating API requests.
   - `DB_PATH` for the SQLite database location.
   - `COMPLIANCE_PLUGIN` to select a compliance feed (nist, cisa_kev, github,
     onetrust, ucf).
4. Launch backend and frontend, then access the dashboard at http://localhost:3000.
5. Submit sample tasks and review compliance results.
6. Integrate with your real IDP, task apps, and policies.
   - Configure SSO with your enterprise IDP (Okta, Azure AD, etc.) using `backend/api/idp.js` as a starting point.
7. Enable any paid integrations (commercial compliance feeds, advanced connectors) via your Layer 8 account. Subscription costs are managed centrally and features are unlocked based on your chosen tier.
8. Monitor system health by scraping `/metrics` and aggregating Pino logs.

## Support

For advanced configuration or troubleshooting, see `DEPLOYMENT.md` or contact your Layer 8 administrator.

## Hybrid-ACP Planning & Execution Layer Separation

- All multi-agent planning and ranking occurs in the planning layer (SMOLAGENT, GPT, Claude).
- Babysitter AI is the sole executor and receives only validated plans.
- Planning agents never receive credentials or perform automation steps.
- Babysitter AI enforces compliance again at runtime and handles stepwise execution.

```
graph LR
  subgraph "Planning Layer"
    SMOLAGENT --> GPT4
    SMOLAGENT --> Claude
    GPT4 --> SMOLAGENT
    Claude --> SMOLAGENT
  end
  subgraph "Execution Layer"
    SMOLAGENT --> Babysitter
    Babysitter --> Browser
  end
```
