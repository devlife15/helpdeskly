# help-deskly

A multi-tenant helpdesk platform built for teams that need more than a ticket queue.

## What it does

help-deskly lets organizations embed a support widget directly into their product. Each organization gets its own isolated widget, powered by a shared backend. Users can raise tickets and ask questions, with answers pulled from company-wide documentation via a built-in RAG pipeline.

## Key features

- Per-organization embeddable widget with isolated data
- Multi-tenant architecture with Clerk-based authentication
- RAG functionality for querying internal company knowledge
- Real-time backend powered by Convex
- Monorepo structure separating the dashboard app and the widget app

## Tech stack

- Next.js (dashboard)
- Convex (real-time backend)
- Clerk (auth and multi-tenancy)
- Vercel AI SDK
- Turborepo (monorepo)
- TypeScript

## Project structure

```
apps/
  dashboard/     # Admin and agent-facing interface
  widget/        # Embeddable customer-facing widget
packages/
  ui/            # Shared components
  convex/        # Shared backend logic
```

## Status

Currently in active development. Running locally.

## Getting started

```bash
pnpm install
pnpm dev
```

> Requires Convex and Clerk credentials. Copy `.env.example` to `.env.local` and fill in your keys.
