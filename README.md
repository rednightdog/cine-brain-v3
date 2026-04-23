# CineBrain Pro

Cinema inventory, compatibility, and project workflow app built with Next.js.

## Getting Started

Install dependencies:

```bash
npm ci
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Checks

Run lint:

```bash
npm run lint
```

Run unit tests:

```bash
npm test
```

Watch tests:

```bash
npm run test:watch
```

Run production build:

```bash
npm run build
```

## CI

GitHub Actions CI is configured at:

`/.github/workflows/ci.yml`

It runs:
1. `npx eslint` on changed lintable source files in the PR/commit
2. `npm test`
3. `npm run build`
