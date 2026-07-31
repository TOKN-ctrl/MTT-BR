# MTT Bankroll Manager

Production-oriented tournament-only poker bankroll management app built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Supabase PostgreSQL/Auth, Zod, React Hook Form, Recharts, and Vitest.

## Local Development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Supabase Setup

1. Create or choose a Supabase project.
2. Apply `supabase/migrations/20260730000000_mtt_bankroll_schema.sql`.
3. Set environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The app intentionally calculates cash bankroll from immutable signed `bankroll_transactions` rows. Tournament tickets and satellite campaign value are tracked separately from cash bankroll.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
