# Layer 8 API Specification

## Endpoints

### POST `/api/tasks`
- **Description:** Submit a new task for planning, compliance, and execution.
- **Body:** `{ "task": { ... }, "userContext": { ... } }`
- **Returns:** Execution result or compliance block.

### GET `/api/tasks`
- **Description:** List all tasks (stub/sample data).

### (Optional) `/api/compliance`
- **Description:** Retrieve compliance status/summary.

## Authentication

- Requests require an `Authorization: Bearer <token>` header.
- Tokens can be validated via built-in API token (`API_TOKEN`) or your enterprise IDP using the stub in `backend/api/idp.js`.

## Errors


