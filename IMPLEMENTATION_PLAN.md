# MTT Bankroll Manager Implementation Plan

1. Inspect repository and scaffold a strict Next.js App Router application.
2. Create Supabase PostgreSQL schema with decimal-safe monetary columns, immutable ledger transactions, ticket separation, and RLS on all public user tables.
3. Add generated-style TypeScript database types and Supabase SSR helpers for cookie-based auth.
4. Implement decimal-safe bankroll, ROI, drawdown, satellite, and rules-engine utilities.
5. Add unit tests for financial calculations and planned tournament classification.
6. Build required routes with dark responsive shadcn-style UI and fast tournament logging forms.
7. Verify linting, type checking, tests, and production build.

## Assumptions

- Base currency defaults to USD until the authenticated user profile or latest rule set defines another base currency.
- Monetary calculations use base-currency values already converted with the stored exchange rate.
- The ledger stores signed cash bankroll movements; corrections should be reversing transactions.
- Ticket face value and satellite campaign value are intentionally excluded from cash bankroll.
