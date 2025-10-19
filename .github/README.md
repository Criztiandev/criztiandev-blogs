# GitHub Actions Workflows

This directory contains CI/CD automation workflows for the portfolio project.

## Workflows

### 🚀 CI/CD Pipeline (`ci-cd.yml`)

Handles continuous integration and deployment to Vercel.

**Triggers**: Push/PR to `main` or `develop`

**Jobs**:

- ✅ Lint & Type Check
- 🔨 Build
- 🌐 Deploy Production (main branch only)
- 🔍 Deploy Preview (PRs only)
- 💡 Lighthouse CI (PRs only)

### 🔒 Security Checks (`security.yml`)

Automated security scanning and dependency audits.

**Triggers**:

- Push/PR to `main`
- Weekly schedule (Mondays 9 AM UTC)

**Jobs**:

- 🛡️ NPM Security Audit
- 📦 Dependency Review
- 🔎 CodeQL Analysis

## Required Secrets

Configure these in **Settings → Secrets and variables → Actions**:

```
VERCEL_TOKEN      # Required for Vercel deployment
GROQ_API_KEY      # Required for AI chat features
```

## Status Badges

Add these to your README.md:

```markdown
![CI/CD](https://github.com/USERNAME/REPO/workflows/CI/CD%20Pipeline/badge.svg)
![Security](https://github.com/USERNAME/REPO/workflows/Security%20&%20Dependency%20Checks/badge.svg)
```

## Documentation

- [Complete CI/CD Setup Guide](../docs/CICD_SETUP.md)
- [AI Model Fallback Strategy](../docs/AI_MODEL_FALLBACK.md)

## Quick Reference

### Manual Workflow Triggers

Go to **Actions** tab → Select workflow → **Run workflow**

### Debugging Failed Workflows

1. Click on failed workflow run
2. Click on failed job
3. Expand failed step
4. Review error logs
5. Fix locally and push again

### Skipping Workflows

Add to commit message:

```bash
git commit -m "docs: update readme [skip ci]"
```
