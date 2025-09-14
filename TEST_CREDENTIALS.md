# Test Credentials

## 🔐 Test User Accounts

### Primary Test User
- **Email:** demo@gmail.com
- **Password:** 12345678
- **Role:** Owner (Full Access)

### Alternative Demo User
- **Email:** demo@fintracker.com
- **Password:** demo123456
- **Role:** Owner (Full Access)

## 📋 Usage Instructions

### Setting Up Test Data

To populate the database with test users and sample data:

```bash
# Using pnpm (recommended)
pnpm db:seed

# Using npm
npm run db:seed
```

### Environment Configuration

For testing purposes, you can use the `.env.test` file:

```bash
# Copy test environment variables
cp .env.test .env.local
```

## ⚠️ Security Notice

**IMPORTANT:** These credentials are for testing and development purposes only. Never use these credentials in production environments.

## 🗂️ Test Data Included

When you run the seed script, it creates:
- 2 test user accounts
- 10 categories (income & expense)
- 3 employees
- Sample income and expense transactions
- 3 assets
- 2 budgets
- 3 goals

## 📁 Related Files

- `/scripts/seed.ts` - Database seeding script
- `/config/test-credentials.json` - Test credentials configuration
- `/.env.test` - Test environment variables

## 🔄 Reset Test Data

To reset and recreate test data, simply run the seed command again:

```bash
pnpm db:seed
```

This will clear existing data and create fresh test data.