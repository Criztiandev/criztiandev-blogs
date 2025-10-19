# CI/CD Setup Guide

Complete guide for setting up continuous integration and deployment for this portfolio project.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Husky Git Hooks](#husky-git-hooks)
3. [GitHub Actions Setup](#github-actions-setup)
4. [Vercel Deployment](#vercel-deployment)
5. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

- Node.js 20+
- npm
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd real-portfolio-wtf

# Install dependencies
npm install

# This automatically runs "npm run prepare" which sets up Husky
```

### Environment Variables

Create `.env.local` in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your Groq API key from: https://console.groq.com/keys

---

## Husky Git Hooks

Husky is automatically configured when you run `npm install`. The following hooks are active:

### Pre-commit Hook

**Location**: `.husky/pre-commit`

**What it does**:

- Runs `lint-staged` on staged files
- Auto-fixes ESLint errors
- Formats code with Prettier
- Runs TypeScript type checking

**Files affected**: Only staged files matching:

- `**/*.{js,jsx,ts,tsx}` - Linted and formatted
- `**/*.{json,css,md,mdx}` - Formatted

**To bypass** (not recommended):

```bash
git commit --no-verify -m "message"
```

### Pre-push Hook

**Location**: `.husky/pre-push`

**What it does**:

- Runs TypeScript type checking across entire project
- Runs production build to catch build errors

**Why**: Prevents pushing code that won't build in CI

**To bypass** (not recommended):

```bash
git push --no-verify
```

### Commit Message Hook

**Location**: `.husky/commit-msg`

**What it does**:

- Validates commit messages follow conventional commits
- Uses commitlint with @commitlint/config-conventional

**Valid commit types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `build`: Build system or dependencies
- `ci`: CI/CD changes
- `chore`: Other changes
- `revert`: Revert previous commit

**Format**: `type(scope): subject`

**Examples**:

```bash
✅ feat: add dark mode toggle
✅ fix: resolve mobile navigation bug
✅ docs: update API documentation
✅ feat(blog): implement infinite scroll
❌ Added new feature  # Missing type prefix
❌ fix bug  # Too vague
```

**To bypass** (not recommended):

```bash
git commit --no-verify -m "any message"
```

---

## GitHub Actions Setup

Two workflows are configured:

### 1. CI/CD Pipeline

**File**: `.github/workflows/ci-cd.yml`

**Triggers**:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs**:

#### Lint & Type Check

- Runs ESLint on all code
- Runs TypeScript type checking
- Fails if any errors found

#### Build

- Builds Next.js application with Turbopack
- Uploads build artifacts
- Requires lint job to pass first

#### Deploy Production

- **Trigger**: Push to `main` branch only
- Deploys to Vercel production environment
- Uses `vercel deploy --prod`
- Posts deployment URL as comment (if PR)

#### Deploy Preview

- **Trigger**: Pull requests only
- Deploys to Vercel preview environment
- Posts preview URL as PR comment

#### Lighthouse CI

- **Trigger**: Pull requests only (after preview deploy)
- Runs performance, accessibility, SEO checks
- Posts Lighthouse scores to PR

### 2. Security Checks

**File**: `.github/workflows/security.yml`

**Triggers**:

- Push to `main` branch
- Pull requests to `main`
- Weekly schedule (Mondays at 9 AM UTC)

**Jobs**:

#### NPM Security Audit

- Runs `npm audit` with moderate severity threshold
- Continues even if vulnerabilities found (non-blocking)
- Shows what `npm audit fix` would do

#### Dependency Review

- Reviews new dependencies in PRs
- Blocks PRs with moderate+ severity issues
- Checks for license compliance

#### CodeQL Analysis

- Static code analysis for JavaScript/TypeScript
- Scans for security vulnerabilities
- Results appear in GitHub Security tab

---

## Vercel Deployment

### Initial Setup

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Select your repository
   - Configure settings:
     - **Framework Preset**: Next.js
     - **Root Directory**: `./`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Set Environment Variables** in Vercel Dashboard:

   ```
   GROQ_API_KEY=your_key_here
   ```

4. **Get Deployment Tokens**
   - Go to Account Settings → Tokens
   - Create new token with deployment permissions
   - Copy token for GitHub secrets

### GitHub Secrets Configuration

Go to your repository → Settings → Secrets and variables → Actions

Add these secrets:

```
VERCEL_TOKEN
  - Your Vercel deployment token
  - Get from: https://vercel.com/account/tokens

GROQ_API_KEY
  - Your Groq API key for AI features
  - Get from: https://console.groq.com/keys
```

**Optional secrets** (for advanced Vercel configuration):

```
VERCEL_ORG_ID
  - Found in: Vercel Team Settings → General

VERCEL_PROJECT_ID
  - Found in: Project Settings → General
```

### Deployment URLs

After setup, deployments will be available at:

- **Production**: `https://your-project.vercel.app`
- **Preview**: `https://your-project-<hash>.vercel.app` (for each PR)

---

## Troubleshooting

### Husky Hooks Not Running

**Problem**: Git hooks don't execute

**Solutions**:

```bash
# Reinstall Husky
npm run prepare

# Check if hooks are executable (Unix/Mac)
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg

# Verify Husky installation
npx husky --version
```

### Pre-commit Hook Fails

**Problem**: `lint-staged` fails

**Solutions**:

```bash
# Run lint-staged manually to see errors
npx lint-staged

# Fix ESLint errors
npm run lint:fix

# Fix formatting
npm run format

# Fix TypeScript errors
npm run type-check
```

### Pre-push Build Fails

**Problem**: Build fails on pre-push hook

**Solutions**:

```bash
# Run build locally to debug
npm run build

# Common issues:
# 1. TypeScript errors - fix with npm run type-check
# 2. Missing env vars - check .env.local
# 3. Import errors - check file paths
```

### Commit Message Rejected

**Problem**: Commit message doesn't follow conventional commits

**Solutions**:

```bash
# Use proper format
git commit -m "feat: your feature description"

# See valid types in commitlint.config.js
cat commitlint.config.js

# Amend last commit message
git commit --amend -m "feat: new message"
```

### GitHub Actions Failing

**Problem**: CI/CD workflow fails

**Check**:

1. Go to Actions tab in GitHub
2. Click failed workflow
3. Review error logs

**Common fixes**:

#### Lint/Type Check Fails

```bash
# Run locally first
npm run validate

# Fix issues
npm run lint:fix
npm run format
```

#### Build Fails

```bash
# Check environment variables in GitHub Secrets
# Verify GROQ_API_KEY is set

# Test build locally
npm run build
```

#### Vercel Deployment Fails

```bash
# Verify GitHub secrets are set:
# - VERCEL_TOKEN
# - GROQ_API_KEY

# Check Vercel project settings match repository
```

### Vercel Deployment Issues

**Problem**: Deployment successful but site doesn't work

**Check**:

1. **Environment Variables**
   - Verify GROQ_API_KEY is set in Vercel dashboard
   - Settings → Environment Variables

2. **Build Logs**
   - Check Vercel deployment logs for errors
   - Deployments → [Your deployment] → Build Logs

3. **Function Logs**
   - Check runtime logs for tRPC/API errors
   - Deployments → [Your deployment] → Function Logs

**Common issues**:

- Missing environment variables
- API route configuration
- Server-side rendering errors

---

## Development Workflow

### Recommended Git Flow

```bash
# 1. Create feature branch
git checkout -b feat/your-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add your feature"
# → Pre-commit hook runs automatically

# 3. Push to GitHub
git push origin feat/your-feature
# → Pre-push hook runs automatically
# → GitHub Actions runs lint, type check, build

# 4. Create Pull Request
# → Preview deployment created
# → Lighthouse CI runs
# → Review preview link in PR comments

# 5. Merge to main
# → Auto-deploys to production
# → Production URL posted in PR
```

### Best Practices

1. **Commit Often**: Small, focused commits with clear messages
2. **Test Locally**: Run `npm run validate` before pushing
3. **Review PRs**: Check preview deployments before merging
4. **Monitor Deployments**: Watch Vercel dashboard for errors
5. **Update Dependencies**: Run `npm audit` and `npm update` regularly

---

## Maintenance

### Weekly Tasks

- Review security audit results (runs automatically every Monday)
- Check for dependency updates
- Monitor Vercel usage/quotas

### Monthly Tasks

- Review and update dependencies: `npm update`
- Check Lighthouse scores and optimize if needed
- Review GitHub Actions usage (check for quota limits)

### As Needed

- Rotate API keys if compromised
- Update Node.js version in workflows
- Adjust Lighthouse CI thresholds

---

## Additional Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [Commitlint](https://commitlint.js.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
