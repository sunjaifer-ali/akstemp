# Akshaya Centre Management System — Foundation v0.1

A fresh, independent foundation for the Akshaya Centre Management System. This project is **not connected to the old/live application**, and no GitHub push, Neon migration, or Vercel deployment has been performed.

## Recommended stack

- Next.js App Router + React + TypeScript
- Neon serverless PostgreSQL
- Drizzle ORM and versioned migrations
- Zod for validation (to be applied at every write/API boundary)
- Vercel for hosting
- GitHub for source control

## Included in this first build

- Responsive dashboard shell and planned module navigation
- Initial PostgreSQL schema for users, customers, services, transactions, balances and audit logs
- Explicit payment destinations, transaction kinds and statuses
- Money arithmetic helpers based on integer paise
- Isolated accounting movement/reconciliation rules
- Initial accounting policy tests
- `.env.example` with no secrets

## Important limitations

This is a **foundation build, not a live-ready accounting app**. Navigation is a visual shell; metrics are placeholders. Authentication, authorization enforcement, forms, API routes, database migration review, audit-safe edits/voids, backups and end-to-end browser tests remain to be built. Do not use it for live centre operations yet.

The schema is a starting point and must be reviewed before a migration is applied to any database.

## Run locally

Requires Node.js 20+.

1. Extract this ZIP.
2. Open a terminal in the project folder and run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Leave `DATABASE_URL` blank for the visual shell. Do not add any live database URL.
5. Run `npm run dev` and open the local URL shown by Next.js.

The dashboard can render without a database. Database operations will fail clearly until a new development Neon database is configured.

## Checks

- `npm test` runs policy-contract checks using Node's built-in test runner.
- `npm run typecheck` checks TypeScript after dependencies are installed.
- `npm run build` runs a production build after dependencies are installed.

## Accounting rules to preserve

- Centre funds are only centre cash, E-district wallet, CSC wallet and centre bank.
- Personal GPay receipts do not increase centre funds.
- Credit given and advance usage are not receipts/payments by themselves.
- Credit repayment counts as centre receipt only when its explicit destination is a centre account.
- Advance received counts as a receipt when received into a centre account; later use against the advance is not a second receipt.
- Centre-to-centre transfers do not change total centre funds.
- Never match transactions just because amounts are equal.
- Unknown historical payment destinations must remain unknown until reviewed.
- Do not silently reinterpret legacy fields or automatically post adjustments.

## Suggested next milestones

1. Add validated server actions/API routes and role-based authentication.
2. Add transaction creation/editing with immutable posted records and void/reversal workflow.
3. Add advances and credit ledgers with partial settlement.
4. Implement daily closing and reconciliation with destination-level balances.
5. Add staff, salary, leave, expenses and reports.
6. Add export/import, scheduled backups and a tested restore procedure.
7. Write automated unit/integration/browser tests using a separate test database.
8. Only after approval, create a fresh GitHub repository, configure a new Neon database, and deploy to a separate Vercel project.

## Secrets and deployment

Never commit `.env.local`, database URLs, passwords, authentication secrets, or production exports. Use a fresh development database and separate Vercel project. Production deployment requires explicit approval.
