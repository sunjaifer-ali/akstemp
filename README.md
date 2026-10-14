# Akshaya Centre Management System — Development MVP

Fresh independent project; not connected to the old/live app.

## Stack
Next.js App Router, React, TypeScript, Neon PostgreSQL, Drizzle ORM, Zod, bcrypt password hashing, signed HTTP-only session cookies, Vercel and GitHub.

## Included
- Responsive management dashboard
- Login API using hashed passwords and expiring HTTP-only sessions
- One-time owner seed script; no default admin/admin credentials
- Customer create/list page and API; GST is optional
- Initial PostgreSQL schema for users, customers, services, transactions, balances, staff profiles and audit log
- Explicit accounting transaction types/payment destinations and reconciliation helper
- Initial accounting policy tests

## Not yet production-ready
Counter transaction entry, credit/advance settlement, expense/salary workflows, daily closing UI, reports, user administration, audit-history UI, rate limiting/CSRF hardening, end-to-end tests, and tested backup/restore remain unfinished. Do not use for live centre transactions. Database migration must only be run against a new development Neon database.

## Setup
1. Install Node.js 20+ and extract this ZIP.
2. Run `npm install` from the project root.
3. Copy `.env.example` to `.env.local`.
4. Create a NEW development database in Neon. Put its connection string in local `.env.local` as `DATABASE_URL`. Never paste secrets into chat or commit them.
5. Generate a random `AUTH_SECRET` with at least 32 characters.
6. Run `npm run db:generate`; inspect the generated migration. Run `npm run db:migrate` only with the new development database configured.
7. Set `OWNER_USERNAME`, `OWNER_PASSWORD` (14+ characters) and `OWNER_DISPLAY_NAME` in your terminal environment, then run `npm run seed:owner` once.
8. Run `npm run dev`.

## Commands
`npm run dev`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run db:generate`, `npm run db:migrate`, `npm run seed:owner`.

## Accounting policies
Centre funds = centre cash + E-district wallet + CSC wallet + centre bank. Personal GPay receipts are not centre funds. Credit given is receivable, not cash; repayments count only when destination is a centre account. Advance receipt counts on receipt date; use of an old advance is not a second receipt. Internal centre transfers do not change total funds. Never match entries only because amounts are equal. Unknown historical destinations remain unknown. Posted records need audited void/reversal semantics before live use.

## Safety
No production DB URL, credentials, migration or deployment is included. Use a separate Neon database and separate Vercel project. Do not deploy or change production without explicit owner approval.
