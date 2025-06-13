# Layer 8 Deployment Guide

This guide describes how to deploy the Layer 8 platform in production environments.

## Requirements

- Node.js >= 20
- Docker
- (Optional) Kubernetes CLI (`kubectl`)
- (Optional) AWS CLI + Terraform
- (Optional) Cloud KMS (AWS KMS, GCP KMS, etc.)

### Environment Variables

- `API_TOKEN` – token for API authentication
- `DB_PATH` – SQLite database path
- `COMPLIANCE_PLUGIN` – which compliance feed to use (nist, cisa_kev, github,
  onetrust, ucf)

## Local Development

1. Clone the repo and install dependencies.
2. Run backend and frontend servers as described in `README.md`.
3. Use provided sample data, or connect to your organization’s IDP/applications.
4. Run `node backend/compliance/refreshPolicies.js` to generate OPA policies from
   the selected compliance feed.

## Docker

1. Build and run containers:
   ```sh
   docker build -t layer8-backend -f infra/docker/Dockerfile.backend .
   docker build -t layer8-frontend -f infra/docker/Dockerfile.frontend .
   docker run -p 4000:4000 layer8-backend
   docker run -p 3000:3000 layer8-frontend
   ```
2. Store secrets in your container platform's secret manager or integrate with KMS.

### Docker Compose

For a local stack with Postgres, Redis and Nginx reverse proxy:

```sh
docker compose -f infra/docker-compose.yml up -d
```

Set `DATABASE_URL`, `OPENAI_API_KEY` and other variables before starting.

## Kubernetes
Deploy using provided manifests:
```sh
kubectl apply -f infra/k8s/backend-deployment.yaml
kubectl apply -f infra/k8s/frontend-deployment.yaml
kubectl apply -f infra/k8s/opa-deployment.yaml
```
Use `kubectl create secret` or your cloud provider's secret store to mount sensitive variables. Consider using a HorizontalPodAutoscaler for scaling under load.

## Terraform (AWS Example)
Configure AWS credentials.
Initialize and apply Terraform:
```sh
cd infra/terraform
terraform init
terraform apply
```

## CI/CD
Uses GitHub Actions (see `infra/ci-cd/github-actions.yaml`).
Example shell deploy script: `infra/ci-cd/deploy.sh`.

## Monitoring and Logging

- Metrics are exposed on `/metrics` in Prometheus format.
- Application logs use the Pino format and can be shipped to any log aggregator.

## Subscription Management for Paid Integrations

Layer 8 bundles the costs of paid integrations (for example, commercial compliance feeds or advanced IDP connectors) into the main product subscription. Individual deployments do not need their own separate subscriptions. These integrations can be toggled through your **Layer 8** account and are enabled as part of enhanced functionality tiers.


