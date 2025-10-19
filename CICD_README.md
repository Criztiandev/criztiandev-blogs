# 🚀 CI/CD & Automation Setup

Complete continuous integration and deployment pipeline with Git hooks automation.

## 📦 What's Included

### 🪝 Git Hooks (Husky)

- **Pre-commit**: Auto-lint, format, and type-check staged files
- **Pre-push**: Full type check and production build validation
- **Commit-msg**: Enforce conventional commit messages

### ⚙️ GitHub Actions

- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Security Scanning**: Weekly vulnerability audits and CodeQL analysis
- **Performance Monitoring**: Lighthouse CI on pull requests

### 🛠️ Tools Integrated

- **Husky** - Git hooks manager
- **Lint-staged** - Run linters on staged files only
- **Prettier** - Code formatting with Tailwind plugin
- **Commitlint** - Conventional commits enforcement
- **GitHub Actions** - CI/CD automation
- **Vercel** - Auto-deployment platform

---

## ⚡ Quick Start

### 1. Install (Already Done)

```bash
npm install  # Automatically runs `npm run prepare` which sets up Husky
```

### 2. Set Up GitHub Secrets

Go to: **Repository Settings → Secrets and variables → Actions**

Add these secrets:

- `VERCEL_TOKEN` - Get from https://vercel.com/account/tokens
- `GROQ_API_KEY` - Get from https://console.groq.com/keys

### 3. Set Up Vercel

```bash
npm i -g vercel
vercel login
vercel link
vercel env add GROQ_API_KEY
```

### 4. Test It

```bash
git checkout -b test/setup
echo "# Test" >> test.md
git add test.md
git commit -m "docs: test CI/CD setup"
git push origin test/setup
```

**✅ Done!** Check the Actions tab and your PR for automated checks.

---

## 📚 Documentation

| Document                                       | Description                           |
| ---------------------------------------------- | ------------------------------------- |
| [Quick Start](docs/QUICK_START_CICD.md)        | Get running in 5 minutes              |
| [Complete Setup Guide](docs/CICD_SETUP.md)     | Detailed setup and troubleshooting    |
| [Setup Summary](docs/SETUP_SUMMARY.md)         | Overview of all configurations        |
| [AI Model Fallback](docs/AI_MODEL_FALLBACK.md) | AI model rotation strategy            |
| [CLAUDE.md](CLAUDE.md)                         | Project documentation for Claude Code |

---

## 🎯 Features

### Local Development Guards

**Pre-commit Hook** (Fast - ~5-15s):

- ✅ ESLint auto-fix on staged files
- ✅ Prettier formatting
- ✅ TypeScript type check (incremental)
- ✅ Only checks staged files

**Pre-push Hook** (Thorough - ~30-60s):

- ✅ Full TypeScript type check
- ✅ Production build validation
- ✅ Catches errors before CI

**Commit Message Validation**:

- ✅ Enforces conventional commits
- ✅ Format: `type(scope): subject`
- ✅ Examples: `feat:`, `fix:`, `docs:`

### CI/CD Pipeline

**On Pull Request**:

1. ✅ Lint & type check entire codebase
2. ✅ Build production bundle
3. ✅ Deploy preview to Vercel
4. ✅ Run Lighthouse CI (performance, accessibility, SEO)
5. ✅ Post preview URL and scores in PR comments

**On Merge to Main**:

1. ✅ Run all checks again
2. ✅ Deploy to Vercel production
3. ✅ Auto-publish to your live site

**Weekly Security Scan**:

1. ✅ NPM security audit
2. ✅ Dependency vulnerability check
3. ✅ CodeQL static analysis

---

## 📋 Available Commands

### Development

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
```

### Code Quality

```bash
npm run lint             # Check for linting issues
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format all code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # Run TypeScript type checking
npm run validate         # Run all checks (type + lint + format)
```

### Blog Management

```bash
npm run new-blog "Title" # Create new blog post
```

---

## 🔍 Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Valid Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `build` - Build system changes
- `ci` - CI/CD changes
- `chore` - Maintenance tasks
- `revert` - Revert previous commit

### Examples

```bash
✅ feat: add dark mode toggle
✅ fix: resolve mobile navigation bug
✅ docs: update API documentation
✅ feat(blog): implement infinite scroll
✅ fix(ai): add model fallback system
✅ perf(images): optimize image loading

❌ Added new feature        # Missing type
❌ fix bug                  # Too vague
❌ updated stuff           # Not descriptive
```

---

## 🔧 Configuration Files

### Husky Hooks

- `.husky/pre-commit` - Runs lint-staged
- `.husky/pre-push` - Runs type check and build
- `.husky/commit-msg` - Validates commit message

### Linting & Formatting

- `.lintstagedrc.js` - Lint-staged configuration
- `.prettierrc` - Prettier rules
- `.prettierignore` - Files to exclude from formatting
- `commitlint.config.js` - Commit message rules

### CI/CD

- `.github/workflows/ci-cd.yml` - Main CI/CD pipeline
- `.github/workflows/security.yml` - Security scanning

---

## 🚨 Troubleshooting

### Hooks Not Running?

```bash
npm run prepare  # Reinstall Husky
```

### Commit Rejected?

```bash
# Use proper format
git commit -m "feat: your feature description"

# See valid types
cat commitlint.config.js
```

### Build Failing?

```bash
# Test locally first
npm run validate  # Run all checks
npm run build     # Test production build
```

### Need to Skip Hooks? (Emergency Only)

```bash
git commit --no-verify -m "message"
git push --no-verify
```

---

## 🎨 Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Local Development                     │
└─────────────────────────────────────────────────────────┘
                           │
                    git commit
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Pre-commit Hook (lint-staged)                          │
│  • ESLint --fix                                         │
│  • Prettier format                                      │
│  • TypeScript check                                     │
└─────────────────────────────────────────────────────────┘
                           │
                    git push
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Pre-push Hook                                          │
│  • Full TypeScript check                                │
│  • Production build                                     │
└─────────────────────────────────────────────────────────┘
                           │
                 Push to GitHub
                           ▼
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions CI/CD                                   │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 1. Lint & Type Check                              │ │
│  └───────────────────────────────────────────────────┘ │
│                        │                                 │
│  ┌───────────────────────────────────────────────────┐ │
│  │ 2. Build                                          │ │
│  └───────────────────────────────────────────────────┘ │
│                        │                                 │
│         ┌──────────────┴──────────────┐                 │
│         ▼                              ▼                 │
│  ┌─────────────┐              ┌──────────────┐         │
│  │   PR Open?  │              │ Main Branch? │         │
│  └─────────────┘              └──────────────┘         │
│         │                              │                 │
│         ▼                              ▼                 │
│  ┌─────────────┐              ┌──────────────┐         │
│  │   Preview   │              │  Production  │         │
│  │  Deployment │              │  Deployment  │         │
│  └─────────────┘              └──────────────┘         │
│         │                                                │
│         ▼                                                │
│  ┌─────────────┐                                        │
│  │ Lighthouse  │                                        │
│  │     CI      │                                        │
│  └─────────────┘                                        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
                  Live on Vercel! 🎉
```

---

## 📊 Status Badges

Add to your README.md:

```markdown
![CI/CD Pipeline](https://github.com/USERNAME/REPO/workflows/CI/CD%20Pipeline/badge.svg)
![Security Checks](https://github.com/USERNAME/REPO/workflows/Security%20&%20Dependency%20Checks/badge.svg)
```

---

## 🎓 Learning Resources

- [Husky Documentation](https://typicode.github.io/husky/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel Deployments](https://vercel.com/docs/deployments/overview)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## ✨ Next Steps

1. ✅ Set up GitHub secrets
2. ✅ Configure Vercel project
3. ✅ Create your first PR to test
4. ✅ Add branch protection rules (recommended)
5. ✅ Share preview URLs with team
6. ✅ Monitor Lighthouse scores

---

## 🤝 Contributing

When contributing to this project:

1. Create a feature branch: `git checkout -b feat/my-feature`
2. Follow commit message format: `feat: add my feature`
3. Let pre-commit hooks fix your code
4. Push and create PR
5. Wait for CI checks to pass
6. Review preview deployment
7. Merge when approved

---

## 📞 Support

- 📖 Check [docs/QUICK_START_CICD.md](docs/QUICK_START_CICD.md) for setup
- 🐛 Check [docs/CICD_SETUP.md](docs/CICD_SETUP.md) for troubleshooting
- 📊 Check [docs/SETUP_SUMMARY.md](docs/SETUP_SUMMARY.md) for overview
- 🤖 Check [docs/AI_MODEL_FALLBACK.md](docs/AI_MODEL_FALLBACK.md) for AI details

---

**Built with ❤️ using modern DevOps best practices**
