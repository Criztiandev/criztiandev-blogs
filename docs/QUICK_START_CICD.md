# Quick Start: CI/CD Setup

Get your CI/CD pipeline running in 5 minutes.

## Prerequisites

- ✅ GitHub repository set up
- ✅ Project cloned locally
- ✅ Dependencies installed (`npm install`)

## Step 1: Verify Husky (30 seconds)

Husky should be automatically installed. Verify it's working:

```bash
# Check if hooks directory exists
ls .husky

# You should see:
# - pre-commit
# - pre-push
# - commit-msg
```

**Test it**:

```bash
# Make a test change
echo "// test" >> src/test.ts

# Try to commit with wrong format
git add src/test.ts
git commit -m "test"  # ❌ Will fail - wrong format

# Use correct format
git commit -m "test: verify husky setup"  # ✅ Will pass
```

## Step 2: Set Up Vercel (2 minutes)

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Set environment variable
vercel env add GROQ_API_KEY
# Enter your key when prompted
# Select all environments (production, preview, development)

# Get your Vercel token for GitHub Actions
vercel whoami
# Go to: https://vercel.com/account/tokens
# Create new token
# Copy it for next step
```

### Option B: Vercel Dashboard

1. Go to https://vercel.com
2. Click **Add New Project**
3. Import your GitHub repository
4. Add environment variable:
   - Name: `GROQ_API_KEY`
   - Value: `your_groq_api_key`
5. Deploy
6. Get token from https://vercel.com/account/tokens

## Step 3: Configure GitHub Secrets (1 minute)

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click **New repository secret**

Add two secrets:

**Secret 1:**

```
Name: VERCEL_TOKEN
Value: [Paste token from Vercel]
```

**Secret 2:**

```
Name: GROQ_API_KEY
Value: [Paste your Groq API key]
```

## Step 4: Test the Pipeline (2 minutes)

### Create Test PR

```bash
# Create feature branch
git checkout -b test/ci-cd-setup

# Make a small change
echo "# CI/CD Test" >> docs/test.md

# Commit with proper format
git add docs/test.md
git commit -m "docs: add CI/CD test file"

# Push (pre-push hooks will run)
git push origin test/ci-cd-setup
```

### Verify in GitHub

1. Go to your repository on GitHub
2. You'll see a prompt to create a Pull Request - click it
3. Create the PR
4. Watch the **Actions** tab - you should see:
   - ✅ Lint & Type Check (running)
   - ✅ Build (running)
   - ✅ Deploy Preview (running after build)

5. After ~2-3 minutes, check the PR comments for:
   - 🔍 Preview deployment URL
   - 💡 Lighthouse CI scores

## Step 5: Verify Everything Works

### Check these items:

✅ **Pre-commit hook works**:

```bash
echo "const test = 'test'" >> src/test.ts
git add src/test.ts
git commit -m "test: commit hook test"
# Should auto-format and type-check
```

✅ **Pre-push hook works**:

```bash
git push
# Should run type check and build
```

✅ **Commit message validation works**:

```bash
git commit -m "invalid message"  # ❌ Should fail
git commit -m "feat: valid message"  # ✅ Should pass
```

✅ **GitHub Actions runs**:

- Go to Actions tab
- See workflow running
- All jobs passing

✅ **Vercel preview deployed**:

- Check PR comments
- Click preview URL
- Site loads correctly

## You're Done! 🎉

Your CI/CD pipeline is now fully operational.

---

## What Happens Now?

### When you commit:

1. Pre-commit hook lints and formats your code
2. Only staged files are checked (fast)

### When you push:

1. Pre-push hook runs full type check and build
2. Takes ~30-60 seconds
3. Catches errors before they reach CI

### When you create a PR:

1. GitHub Actions runs automatically
2. Lints, type checks, and builds your code
3. Deploys preview to Vercel
4. Runs Lighthouse CI
5. Posts results in PR comments

### When you merge to main:

1. GitHub Actions deploys to production
2. Your site goes live on Vercel
3. Takes ~2-3 minutes

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Test production build
npm run validate         # Run all checks locally

# Code Quality
npm run lint             # Check for issues
npm run lint:fix         # Auto-fix issues
npm run format           # Format all code
npm run type-check       # TypeScript check

# Git
git commit -m "feat: message"     # Correct format
git commit --no-verify            # Bypass hooks (emergency only)
git push                          # Triggers pre-push hook
```

---

## Troubleshooting

### "Husky hooks not running"

```bash
npm run prepare
```

### "GitHub Actions not running"

- Check Settings → Actions → General
- Ensure "Allow all actions" is enabled

### "Vercel deployment fails"

- Verify `VERCEL_TOKEN` secret is correct
- Check `GROQ_API_KEY` is set in Vercel dashboard
- View deployment logs in Vercel

### "Build fails on pre-push"

```bash
# Run locally to debug
npm run build

# Common fixes:
npm run type-check  # Fix TypeScript errors
npm run lint:fix    # Fix ESLint errors
```

---

## Need More Help?

- 📖 [Complete Setup Guide](./CICD_SETUP.md)
- 📊 [Setup Summary](./SETUP_SUMMARY.md)
- 🤖 [AI Model Fallback](./AI_MODEL_FALLBACK.md)
- 📝 [CLAUDE.md](../CLAUDE.md)

---

## Advanced: Branch Protection (Optional)

Recommended for team projects:

1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks: `Lint & Type Check`, `Build`
   - ✅ Require branches to be up to date
4. Save

Now all code must pass CI before merging to main!
