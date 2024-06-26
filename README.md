[![tests](https://github.com/akauste/tehty/actions/workflows/test.yml/badge.svg)](https://github.com/akauste/tehty/actions/workflows/test.yml)

# TEHTY app

This is a practice project that implements Kanban board and Todo lists. You can check out the working app at
[tehty-akauste.vercel.app](https://tehty-akauste.vercel.app)

## Usage

App requires you to login (either with github or google account).

After login there is two apps that you can use. Todo app for managing simple todo list and Kanban app where you
can create boards and organize tasks via drag and drop.

## Tech stack

The app is written using these tools & techiniques:

- Next.js
- Next-auth (google & github authentication providers configured)
- PostgreSQL
- Tailwind CSS
- Vitest

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Configuration

Some environment variables are needed:

```bash
# You can use postgres database directly or vercel postgres
# 1: Using regular postgres connection set these variables (you can use docker container, with defaults and
# zero configuration is needed)
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=mydb
# 2: Postgres url in a format that @vercel/kysely requires, running in vercel requires just the POSTGRES_URL:
VERCEL_ENV=true
POSTGRES_URL=...

# Ie locally: http://localhost:3000
NEXT_PUBLIC_URL=...

# To set up the authentication you need to configure:
# Github app configuration for github Oauth provider:
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
# Google Oauth provider config:
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
# Next auth secret:
AUTH_SECRET=...
```

## Testing

```bash
# Unit testing
npm run test
# Integration testing
npm run integration:test
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
