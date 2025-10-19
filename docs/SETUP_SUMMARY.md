# CI/CD & Husky Setup Summary

Complete overview of the CI/CD pipeline and Git hooks integration for the portfolio project.

## ✅ What Was Set Up

### 1. Husky Git Hooks

**Installed packages**:

- `husky@^9.1.7` - Git hooks manager
- `lint-staged@^16.2.4` - Run linters on staged files
- `@commitlint/cli@^20.1.0` - Commit message linter
- `@commitlint/config-conventional@^20.0.0` - Conventional commits config
- `prettier@^3.6.2` - Code formatter
- `prettier-plugin-tailwindcss@^0.7.1` - Tailwind CSS class sorting

**Configured hooks**:

- `.husky/pre-commit` → Runs lint-staged (ESLint + Prettier + TypeScript)
- `.husky/pre-push` → Runs type check and build
- `.husky/commit-msg` → Validates commit message format

**Configuration files**:

- `.lintstagedrc.js` - Lint-staged configuration
- `commitlint.config.js` - Commit message rules
- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files to exclude from formatting

### 2. GitHub Actions Workflows

**CI/CD Pipeline** (`.github/workflows/ci-cd.yml`):

- Lint & type checking on every push/PR
- Production deployment to Vercel on `main` branch
- Preview deployments for pull requests
- Lighthouse CI for performance monitoring

**Security Workflow** (`.github/workflows/security.yml`):

- NPM security audits
- Dependency review for PRs
- CodeQL static analysis
- Weekly automated scans

### 3. Package.json Scripts

Added new scripts:

```json
{
  "lint:fix": "eslint --fix",
  "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md,mdx}\"",
  "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md,mdx}\"",
  "type-check": "tsc --noEmit",
  "validate": "npm run type-check && npm run lint && npm run format:check"
}
```

### 4. Documentation

Created comprehensive documentation:

- `docs/CICD_SETUP.md` - Complete setup and troubleshooting guide
- `docs/AI_MODEL_FALLBACK.md` - AI model fallback strategy
- `.github/README.md` - Quick reference for workflows
- Updated `CLAUDE.md` - Added CI/CD section

---

## 🚦 How It Works

### Local Development Flow

```
1. Make changes to code
   ↓
2. git add .
   ↓
3. git commit -m "feat: add feature"
   ↓
   [Pre-commit hook runs]
   - Lint staged files
   - Format code
   - Type check
   ↓
4. git push
   ↓
   [Pre-push hook runs]
   - Full type check
   - Production build
   ↓
5. Push successful
```

### CI/CD Flow (Pull Request)

```
1. Push to feature branch
   ↓
2. Create Pull Request
   ↓
   [GitHub Actions triggers]
   ↓
3. Lint & Type Check job runs
   ↓
4. Build job runs
   ↓
5. Deploy Preview job runs
   - Deploys to Vercel preview URL
   - Posts URL in PR comments
   ↓
6. Lighthouse CI runs
   - Tests performance
   - Posts scores in PR
   ↓
7. Review & merge
```

### CI/CD Flow (Production)

```
1. Merge PR to main
   ↓
   [GitHub Actions triggers]
   ↓
2. Lint & Type Check
   ↓
3. Build
   ↓
4. Deploy to Vercel Production
   - Live at production URL
   - Comment posted with URL
```

---

## 🔧 Configuration Details

### Husky Hooks Behavior

**Pre-commit** (Fast - only staged files):

- ESLint auto-fix on `.js`, `.jsx`, `.ts`, `.tsx`
- Prettier format on all applicable files
- TypeScript type check (incremental)
- ⏱️ Usually takes 5-15 seconds

**Pre-push** (Slower - full project):

- Full TypeScript type check
- Complete production build
- ⏱️ Usually takes 30-60 seconds

**Commit-msg**:

- Validates format: `type(scope): subject`
- Max 100 characters
- Required types: feat, fix, docs, etc.
- ⏱️ Instant

### Lint-staged Rules

```javascript
{
  // TypeScript/JavaScript files
  '**/*.{js,jsx,ts,tsx}': [
    'eslint --fix',           // Fix linting errors
    'prettier --write',       // Format code
  ],

  // Other files
  '**/*.{json,css,md,mdx}': [
    'prettier --write',       // Format code
  ],

  // Type checking
  '**/*.{ts,tsx}': () => 'tsc --noEmit',
}
```

### Prettier Configuration

```json
{
  "semi": true, // Use semicolons
  "trailingComma": "es5", // Trailing commas in ES5
  "singleQuote": false, // Use double quotes
  "printWidth": 100, // Line width 100 chars
  "tabWidth": 2, // 2 spaces per indent
  "useTabs": false, // Use spaces
  "plugins": ["prettier-plugin-tailwindcss"] // Sort Tailwind classes
}
```

### Commitlint Rules

Valid commit types:

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Tests
- `build` - Build system
- `ci` - CI/CD changes
- `chore` - Maintenance tasks
- `revert` - Revert commit

---

## 📋 Required Setup Steps

### 1. Local Setup (Automatic)

✅ Already done when you run `npm install`

The `prepare` script automatically runs `husky` to set up Git hooks.

### 2. GitHub Secrets (Manual)

Go to GitHub repository → Settings → Secrets and variables → Actions

**Add these secrets**:

```
Name: VERCEL_TOKEN
Value: [Get from https://vercel.com/account/tokens]

Name: GROQ_API_KEY
Value: [Get from https://console.groq.com/keys]
```

### 3. Vercel Project (Manual)

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. Add environment variable:
   - `GROQ_API_KEY` = your Groq API key

### 4. Enable GitHub Actions (Usually enabled by default)

1. Go to repository Settings → Actions → General
2. Ensure "Allow all actions and reusable workflows" is selected
3. Save

---

## 🎯 Benefits

### For Developers

✅ **Code Quality**:

- Automatic linting and formatting
- Type safety enforced
- Consistent code style

✅ **Fast Feedback**:

- Catch errors before pushing
- Build validation locally
- Quick iteration cycle

✅ **Conventional Commits**:

- Clean git history
- Auto-generated changelogs
- Semantic versioning ready

### For Team

✅ **Automated Testing**:

- CI runs on every PR
- No broken code in main
- Preview deployments for testing

✅ **Security**:

- Weekly vulnerability scans
- Dependency review
- CodeQL analysis

✅ **Performance Monitoring**:

- Lighthouse CI on PRs
- Performance regression detection
- SEO and accessibility checks

### For Deployment

✅ **Zero-Config Deployments**:

- Auto-deploy on merge to main
- Preview URLs for PRs
- Instant rollback capability

✅ **Reliability**:

- Build validation before deploy
- Type checking enforced
- No runtime surprises

---

## 🐛 Common Issues & Solutions

### Issue: Husky hooks not running

**Solution**:

```bash
npm run prepare
# or
npx husky install
```

### Issue: Pre-commit too slow

**Solution**: Only stage files you want to commit

```bash
git add src/components/MyComponent.tsx  # Instead of git add .
git commit -m "feat: update component"
```

### Issue: Need to bypass hooks temporarily

**Solution**: Use `--no-verify` flag (not recommended)

```bash
git commit --no-verify -m "message"
git push --no-verify
```

### Issue: Commit message rejected

**Solution**: Follow conventional commits format

```bash
# ❌ Wrong
git commit -m "updated stuff"

# ✅ Right
git commit -m "feat: add user authentication"
git commit -m "fix: resolve login button bug"
git commit -m "docs: update API documentation"
```

### Issue: GitHub Actions failing

**Solution**: Run validation locally first

```bash
npm run validate  # Runs type-check + lint + format:check
npm run build     # Test production build
```

### Issue: Vercel deployment fails

**Solution**: Check environment variables

1. Ensure `GROQ_API_KEY` is set in Vercel
2. Verify GitHub secret `VERCEL_TOKEN` is correct
3. Check Vercel build logs for errors

---

## 📊 Workflow Status

### Check Workflow Status

1. Go to GitHub repository
2. Click **Actions** tab
3. View recent workflow runs
4. Green ✅ = passing, Red ❌ = failing

### Add Status Badges to README

```markdown
![CI/CD](https://github.com/USERNAME/REPO/workflows/CI/CD%20Pipeline/badge.svg)
![Security](https://github.com/USERNAME/REPO/workflows/Security%20&%20Dependency%20Checks/badge.svg)
```

---

## 🔗 Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [Lint-staged](https://github.com/okonet/lint-staged)
- [Commitlint](https://commitlint.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel Deployments](https://vercel.com/docs/deployments/overview)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## 📝 Next Steps

1. ✅ Set up GitHub secrets (VERCEL_TOKEN, GROQ_API_KEY)
2. ✅ Configure Vercel project
3. ✅ Enable GitHub Actions
4. ✅ Create your first PR to test the workflow
5. ✅ Review Lighthouse CI scores
6. ✅ Set up branch protection rules (optional but recommended)

### Recommended Branch Protection Rules

Settings → Branches → Add rule for `main`:

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
  - Select: `Lint & Type Check`
  - Select: `Build Application`
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings

This ensures all code is reviewed and passes CI before merging to production.
