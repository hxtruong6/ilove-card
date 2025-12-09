# iCard Testing - Quick Start 🚀

Automated test suite for your festive message tree platform.

## Quick Run Commands

```bash
# Run MVP Smoke Test (most important!)
pnpm cypress run --spec "cypress/e2e/mvp-smoke-test.cy.ts"

# Open Cypress UI (recommended for development)
pnpm cypress

# Run all E2E tests (headless)
pnpm test:e2e

# Run unit tests
pnpm test
```

## Test Files

- **`mvp-smoke-test.cy.ts`** - Complete user journey (registration → tree → messages)
- **`auth.cy.ts`** - Authentication & account locking
- **`tree-management.cy.ts`** - Tree CRUD & sharing
- **`messages.cy.ts`** - Message creation, editing, deletion

## First Time Setup

```bash
# Install dependencies
pnpm install

# Start dev server (in separate terminal)
pnpm dev

# Run tests
pnpm cypress
```

## Before Production Deploy

```bash
# 1. Start dev server
pnpm dev

# 2. Run smoke test in separate terminal
pnpm cypress run --spec "cypress/e2e/mvp-smoke-test.cy.ts"

# 3. If passes ✅, deploy!
```

## Troubleshooting

**Tests won't run?**

- Check dev server is running: `http://localhost:3000`
- Verify `.env` has `DATABASE_URL`
- Run `pnpm install` and `pnpm prisma generate`

**Tests failing?**

- Check console for specific errors
- Review screenshots in `cypress/screenshots/`
- Watch videos in `cypress/videos/`

## Documentation

Full testing guide: [`testing_guide.md`](file:///Users/xuantruong/.gemini/antigravity/brain/60e61f38-1fce-4f7a-bdce-b878ae87a88f/testing_guide.md)

---

**Happy Testing! 🎄**
