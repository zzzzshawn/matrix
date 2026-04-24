# Dotmatrix Loader Library

Reusable dotmatrix-style loading animations with two consumption paths:

1. shadcn registry install (primary)
2. Manual source copy/paste from docs (secondary)

## Layout

Single Next.js app: loader components live in `loaders/`, app routes in `app/`, and the shadcn-style registry is built into `registry.json` and `public/r/`.

## Commands

- `pnpm dev`: run the docs app
- `pnpm registry:build`: generate `registry.json` and `public/r/*`
- `pnpm test`: run tests
- `pnpm typecheck`: run TypeScript checks
