# Payroll System — AI Rewrite Experiment

[![CI](https://github.com/JLtheCoder/payroll-system-2019/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/JLtheCoder/payroll-system-2019/actions/workflows/ci.yml)

This repository is a personal experiment: using an **AI coding agent** to rewrite
an old, hand-written code sample from **2019** into modern **TypeScript**.

It contains two versions of the same payroll web app, side by side:

| Folder                                                 | Description                                                                                                                        |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| [`2019-hand-written/`](./2019-hand-written)            | The original 2019 JavaScript/React code sample, kept as-is for reference.                                                          |
| [`ai-typescript-rewrite/`](./ai-typescript-rewrite)    | A TypeScript rewrite produced with AI assistance — an npm workspaces monorepo (Express API + Vite/React client).                    |

## What this is (and isn't)

- It is an **experiment**, not production software.
- The original is left **untouched**; the rewrite lives alongside it so the two
  can be compared.
- Each folder has its own `README.md` with build/run instructions.

## The original sample

The 2019 sample was a coding-challenge-style payroll prototype: upload a CSV time
report, archive the timekeeping data, and generate a biweekly payroll report.
The original brief is in
[`2019-hand-written/instructions/`](./2019-hand-written/instructions).

## The rewrite

See [`ai-typescript-rewrite/README.md`](./ai-typescript-rewrite/README.md) for the
stack, setup instructions, and notes on what changed. Agents and contributors
should also read
[`ai-typescript-rewrite/AGENT.md`](./ai-typescript-rewrite/AGENT.md).

## Caveats

This code was produced largely by an AI agent and may contain mistakes. Treat it
as an experiment and review it yourself before relying on it.
