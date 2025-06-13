# AGENTS.md

## Layer 8: Agent & Execution Architecture

### Overview

Layer 8 is architected as a multi-agent orchestration platform with a **strict separation between planning (advisory) and execution layers**. The only entity ever permitted to execute real-world actions, interact with credentials, or trigger browser/API automation is **Babysitter AI**. All planning and compliance advisory logic is handled by non-privileged agents or plug-ins, each with a clearly defined role.

---

## Agent Directory

| Name            | Type        | Path                                 | Execution Privilege | Purpose                                                       |
|-----------------|-------------|--------------------------------------|---------------------|---------------------------------------------------------------|
| Babysitter AI   | Executor    | `/backend/agents/babysitter.js`      | ✅ Yes              | Validates and executes plans, performs browser/API automation, logs actions. |
| SMOLAGENT       | Planner     | `/backend/agents/smolagent.js`       | ❌ No               | Aggregates and ranks plans from multiple planners; manages Hybrid-ACP logic. |
| Planner (LLMs)  | Planner     | `/backend/agents/planner.js`         | ❌ No               | Generates detailed step-by-step plans from task intent (calls LLMs).         |
| Compliance Plug-ins | Compliance | `/backend/compliance/inputs/`      | ❌ No               | Supplies regulatory/control data from open or commercial feeds to OPA.       |
| Local LLM Plug-in | Refinement  | `/backend/agents/plugins/localLLM.js`| ❌ No               | (Optional) Refines plans using a local LLM for privacy/air-gapped use cases. |

---

## Hybrid-ACP Planning Model

- **Planning Layer**: All multi-agent planning (debate, proposal, ranking, compliance scoring) happens here. No planning agent has execution privilege.
    - Agents: SMOLAGENT, external LLM planners (GPT-4, Claude, etc.), optional helpers.
    - Plug-ins: Compliance data and local LLM plug-ins can be used for plan refinement or regulatory feeds.
- **Execution Layer**: Only **Babysitter AI** receives the validated plan and is allowed to:
    - Re-validate for compliance (OPA, LettuceDetect, CAG + A-MEM).
    - Execute browser/API/system actions.
    - Handle exceptions, escalate to HITL (human-in-the-loop), log actions and decisions.

**NO agent but Babysitter AI can ever:**
- See or use real credentials
- Interact with browsers, APIs, or systems
- Write to production systems

---

## Agent Roles

### Babysitter AI
- Receives final execution plan only.
- Calls compliance checks (OPA, LettuceDetect) at execution time.
- Executes all steps via browser or API adapters (Playwright/Selenium, etc.).
- Handles runtime exceptions, escalations, and full audit logging.

### SMOLAGENT
- Orchestrates plan generation and debate among planners.
- Selects best plan using compliance and performance scores.
- Only passes the validated plan downstream—never executes steps.

### Planner Agents (LLMs)
- Generate detailed execution plans from high-level task requests.
- No access to credentials or automation.

### Compliance Plug-ins
- Fetch, parse, and supply regulatory/control frameworks from public (NIST, CISA KEV) or enterprise (OneTrust, UCF) sources.
- Used by OPA policy generator and refresher.
- Pluggable and updatable at runtime/config.

### Local LLM Plug-in (Optional)
- Refines/rewrites plans for local environment or privacy-critical use cases.
- Can be toggled per-client; never executes tasks.

---

## Data Flow

1. **User submits a task** via the API/UI.
2. **SMOLAGENT** invokes planner agents to propose and debate plans.
3. **Best plan** is selected, scored for compliance (using latest controls from plug-ins).
4. **Optionally refined** via local LLM plug-in (if enabled for client/tenant).
5. **Babysitter AI** receives plan, re-checks compliance, executes, logs every step and compliance action.
6. **All actions and compliance events are auditable** (blockchain-style logging available).

---

## Plug-in/Extension Points

- **Adding new planners/LLMs**: Drop in agent, wire to SMOLAGENT via interface.
- **New compliance feeds**: Add a new plug-in in `/backend/compliance/inputs/`, set via `COMPLIANCE_PLUGIN` config/env.
- **Local LLMs**: Implement plug-in as `/backend/agents/plugins/localLLM.js`, toggle per client in config.

No plug-in can ever bypass compliance or access execution privileges.

---

## Security Principles

- **Zero standing privilege**: All privileged actions are ephemeral and auditable.
- **All execution is via Babysitter AI**; strict runtime compliance checks.
- **All control data is versioned and auditable.**
- **Plug-ins for regulatory feeds and local LLMs** are drop-in and upgradeable without system downtime.

---

## Mermaid Diagram: Agent Model

```mermaid
graph TD
    subgraph Planning Layer (ACP Agents)
        SMOLAGENT -- "propose" --> GPT4
        SMOLAGENT -- "propose" --> Claude
        GPT4 -- "plan" --> SMOLAGENT
        Claude -- "plan" --> SMOLAGENT
        SMOLAGENT -- "finalize" --> Babysitter
    end

    subgraph Execution Layer (Babysitter AI)
        Babysitter -- "executes" --> Apps[Target Apps, Browser, API]
        Babysitter -- "logs" --> Audit[Audit/Blockchain Log]
    end
```

---

## Compliance Plug-in API Contract

```js
// Compliance Input Plug-in Example
async function get_controls() {
  // Returns: [{ control_id, description, mappings, updated, source }]
}
module.exports = { get_controls };
```

---

**For further details, see ONBOARDING.md, ask your Layer 8 admin, or view the agent source code for implementation details.**

