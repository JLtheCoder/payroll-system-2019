# AGENT.md

Context for AI agents (and humans) working in this repository.

## What this repo is

An **experiment**: using an AI coding agent to rewrite an old, hand-written code
sample from **2019** into modern **TypeScript**. Treat the repo as a sandbox,
not production code.

## Layout

- `2019-hand-written/` — the original code sample. **Reference only.** Do not
  modify it; it exists so the rewrite can be compared against it.
- `ai-typescript-rewrite/` — the AI-generated TypeScript rewrite. This is the
  only folder to edit for the experiment. It is an npm workspaces monorepo:
  - `server/` — Express + Prisma API (TypeScript, run via `tsx`)
  - `client/` — React + Vite + Tailwind frontend
  - `e2e/` — Playwright browser end-to-end tests (run via `npm run test:e2e`)

## Working rules

- **Do not modify `2019-hand-written/`.** Treat it as read-only input.
- Make changes inside `ai-typescript-rewrite/` and follow that folder's
  [`AGENT.md`](./ai-typescript-rewrite/AGENT.md) for commands, conventions,
  architecture, and gotchas.
- Keep the two versions comparable: the rewrite should preserve the original's
  behaviour unless a change is explicitly called out in
  `ai-typescript-rewrite/README.md`.

## Goal

Explore how well an AI agent can migrate a legacy JavaScript codebase to modern
TypeScript — updated libraries and tooling, proper typing, and tests — while
keeping the original around as a reference.
