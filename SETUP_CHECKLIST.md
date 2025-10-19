# ✅ CI/CD Setup Checklist

Use this checklist to ensure your CI/CD pipeline is fully configured.

## 🎯 Installation Verification

### Local Setup

- [x] **Husky installed** - `npm install` completed successfully
- [x] **Git hooks created** - `.husky/pre-commit`, `.husky/pre-push`, `.husky/commit-msg` exist
- [x] **Prettier installed** - `npx prettier --version` works
- [x] **Commitlint installed** - `npx commitlint --version` works
- [x] **Lint-staged configured** - `.lintstagedrc.js` exists

**Verify with**:

```bash
ls -la .husky
npx husky --version
npx prettier --version
npx commitlint --version
```

---

## 🔧 Configuration Files

- [x] `.husky/pre-commit` - Lint-staged configuration
- [x] `.husky/pre-push` - Type check and build
- [x] `.husky/commit-msg` - Commitlint validation
- [x] `.lintstagedrc.js` - Lint-staged rules
- [x] `commitlint.config.js` - Commit message rules
- [x] `.prettierrc` - Prettier configuration
- [x] `.prettierignore` - Prettier ignore rules
- [x] `.github/workflows/ci-cd.yml` - Main CI/CD pipeline
- [x] `.github/workflows/security.yml` - Security scanning

**Verify with**:

```bash
cat .lintstagedrc.js
cat commitlint.config.js
cat .prettierrc
ls -la .github/workflows
```

---

## 📝 Documentation

- [x] `CICD_README.md` - Main CI/CD documentation
- [x] `docs/QUICK_START_CICD.md` - 5-minute setup guide
- [x] `docs/CICD_SETUP.md` - Complete setup guide
- [x] `docs/SETUP_SUMMARY.md` - Configuration overview
- [x] `docs/AI_MODEL_FALLBACK.md` - AI model strategy
- [x] `CLAUDE.md` - Updated with CI/CD section
- [x] `.github/README.md` - Workflows documentation

**Verify with**:

```bash
ls -la docs/*.md
```

---

## 🧪 Testing Local Hooks

### Test Pre-commit Hook

- [ ] Create test file: `echo "const test = 'test'" > src/test.ts`
- [ ] Stage file: `git add src/test.ts`
- [ ] Commit with wrong format: `git commit -m "test"` → Should fail ❌
- [ ] Commit with correct format: `git commit -m "test: verify hooks"` → Should pass ✅
- [ ] Verify file was auto-formatted and linted

```bash
# Test it
echo "const test = 'test'" > src/test-hook.ts
git add src/test-hook.ts
git commit -m "test"  # Should fail
git commit -m "test: verify pre-commit hook"  # Should pass
git reset HEAD~1  # Undo the commit
rm src/test-hook.ts  # Clean up
```

### Test Pre-push Hook

- [ ] Make a commit
- [ ] Push to remote: `git push`
- [ ] Verify type check runs
- [ ] Verify build runs
- [ ] Push completes successfully

```bash
# Test it (creates a test branch)
git checkout -b test/pre-push-hook
echo "# Test" > test-file.md
git add test-file.md
git commit -m "test: verify pre-push hook"
git push origin test/pre-push-hook  # Should run type-check and build
git checkout main
git branch -D test/pre-push-hook
```

### Test Commit Message Validation

- [ ] Try invalid message: `git commit -m "invalid"` → Should fail ❌
- [ ] Try valid message: `git commit -m "feat: test"` → Should pass ✅

```bash
# Test it
echo "test" > test.txt
git add test.txt
git commit -m "invalid message"  # Should fail
git commit -m "feat: valid message"  # Should pass
git reset HEAD~1  # Undo
rm test.txt
```

---

## ☁️ GitHub & Vercel Setup

### GitHub Secrets

Navigate to: **Repository Settings → Secrets and variables → Actions**

- [ ] `VERCEL_TOKEN` added (from https://vercel.com/account/tokens)
- [ ] `GROQ_API_KEY` added (from https://console.groq.com/keys)

**Verify**:

- Go to your GitHub repository
- Settings → Secrets and variables → Actions
- Both secrets should be listed (values are hidden)

### Vercel Project

- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Environment variable `GROQ_API_KEY` set in Vercel
- [ ] Initial deployment successful
- [ ] Production URL accessible

**Verify with**:

```bash
vercel whoami  # Should show your username
vercel ls      # Should list your project
```

**Or check Vercel Dashboard**:

- Go to https://vercel.com/dashboard
- Your project should be listed
- Settings → Environment Variables → `GROQ_API_KEY` should exist

### GitHub Actions

- [ ] Actions enabled in repository
- [ ] Workflows visible in Actions tab
- [ ] No workflow errors

**Verify**:

- Go to your GitHub repository
- Click **Actions** tab
- Should see "CI/CD Pipeline" and "Security & Dependency Checks" workflows

---

## 🚀 End-to-End Testing

### Create Test Pull Request

- [ ] Create feature branch
- [ ] Make a change
- [ ] Commit with proper message
- [ ] Push to GitHub
- [ ] Create Pull Request
- [ ] Wait for CI to complete
- [ ] Verify all checks pass ✅
- [ ] Preview deployment URL posted
- [ ] Lighthouse CI scores posted

```bash
# Complete test flow
git checkout -b test/ci-cd-pipeline

# Make a change
echo "# CI/CD Test" > docs/ci-cd-test.md

# Commit (pre-commit hook runs)
git add docs/ci-cd-test.md
git commit -m "docs: test CI/CD pipeline"

# Push (pre-push hook runs)
git push origin test/ci-cd-pipeline

# Now go to GitHub and create a PR
# Watch the Actions tab - all should pass
# Check PR comments for preview URL
```

### Verify CI/CD Jobs

In the PR, check that these jobs ran successfully:

- [ ] ✅ **Lint & Type Check** - Passed
- [ ] ✅ **Build Application** - Passed
- [ ] ✅ **Deploy Preview** - Passed
- [ ] ✅ **Lighthouse CI** - Ran and posted scores

### Verify Preview Deployment

- [ ] Preview URL posted in PR comments
- [ ] Preview site loads correctly
- [ ] All features work on preview
- [ ] Lighthouse scores acceptable (>80)

### Test Production Deployment

- [ ] Merge test PR to main
- [ ] Production deployment triggers automatically
- [ ] Production deployment succeeds
- [ ] Live site updated

```bash
# After testing, clean up
git checkout main
git pull origin main
git branch -D test/ci-cd-pipeline
git push origin --delete test/ci-cd-pipeline
```

---

## 🎨 Optional: Branch Protection

Recommended for team projects.

- [ ] Go to Settings → Branches
- [ ] Add rule for `main` branch
- [ ] Enable "Require pull request reviews"
- [ ] Enable "Require status checks to pass"
- [ ] Select required checks:
  - [ ] `Lint & Type Check`
  - [ ] `Build Application`
- [ ] Enable "Require branches to be up to date"
- [ ] Save changes

**Verify**:

- Try pushing directly to main → Should be blocked
- Must go through PR process

---

## 📊 Status Summary

### ✅ All Green - Ready to Go!

If all items above are checked, your CI/CD pipeline is fully operational!

**You now have**:

- ✅ Automated code quality checks
- ✅ Conventional commit enforcement
- ✅ Type safety validation
- ✅ Automated deployments
- ✅ Preview environments
- ✅ Performance monitoring
- ✅ Security scanning

### ⚠️ Some Items Pending

If some items are unchecked:

**Critical** (Required for CI/CD):

- GitHub secrets (`VERCEL_TOKEN`, `GROQ_API_KEY`)
- Vercel project setup
- GitHub Actions enabled

**Important** (Required for hooks):

- Husky installation
- Git hooks configured

**Optional** (Nice to have):

- Branch protection rules
- Lighthouse CI passing

---

## 🔄 Regular Maintenance

### Weekly

- [ ] Review security scan results (automated)
- [ ] Check Lighthouse scores on recent PRs
- [ ] Review dependency updates

### Monthly

- [ ] Update dependencies: `npm update`
- [ ] Check GitHub Actions usage
- [ ] Review Vercel usage/quotas

### As Needed

- [ ] Rotate API keys if compromised
- [ ] Update workflow configurations
- [ ] Adjust Lighthouse thresholds

---

## 📞 Need Help?

If something isn't working:

1. ✅ Check this checklist
2. 📖 Read [Quick Start Guide](docs/QUICK_START_CICD.md)
3. 🔧 Check [Troubleshooting Section](docs/CICD_SETUP.md#troubleshooting)
4. 📊 Review [Setup Summary](docs/SETUP_SUMMARY.md)

---

## 🎉 Success Criteria

Your setup is complete when:

- ✅ Pre-commit hook auto-formats code
- ✅ Pre-push hook validates build
- ✅ Commit messages follow conventional format
- ✅ GitHub Actions run on every PR
- ✅ Preview deployments work
- ✅ Production deploys on merge to main
- ✅ Lighthouse CI posts scores
- ✅ Security scans run weekly

**Congratulations! 🎊 Your CI/CD pipeline is production-ready!**
