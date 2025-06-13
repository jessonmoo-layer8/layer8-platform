# Layer 8 Documentation

This directory collects reference guides for deploying and operating the Layer 8 platform.

## Compliance Feed Plug‑ins

Set `COMPLIANCE_PLUGIN` to select a compliance feed. Open options include `nist`, `cisa_kev`, and `github`. Commercial integrations like OneTrust or UCF can be enabled later and are centrally billed through your Layer 8 subscription.

## Monitoring & Logging

- Prometheus metrics are exposed on `/metrics` from the backend.
- Pino formatted logs can be forwarded to your log aggregator.

## Deployment Overview

See `DEPLOYMENT.md` for Docker, Kubernetes, and Terraform instructions. A CI/CD pipeline is provided in `infra/ci-cd/github-actions.yaml`. The repository is designed for easy GitHub uploads with branch protection and secrets configured in the Actions environment.
