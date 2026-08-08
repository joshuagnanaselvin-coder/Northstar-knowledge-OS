# Placeholder Dockerfile for root-level Cloud Build compatibility
# Actual deployment uses GitHub Actions + docker-compose in backend/frontend/
# This file prevents Cloud Build errors if a trigger fires accidentally

FROM alpine:latest
CMD ["echo", "NorthStar Knowledge OS - Deployed via GitHub Actions. This Dockerfile is a placeholder."]
