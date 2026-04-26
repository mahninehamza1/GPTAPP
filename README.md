# Agency Brief Generator Tool

A production-ready Next.js app for collecting structured client inputs and automatically generating a strategic brief.

## Architecture (before coding)

- **Frontend (Next.js App Router)**: Multi-step form built with React Hook Form + Zod, styled via Tailwind with reusable shadcn-style UI primitives.
- **Backend (Next.js Route Handlers)**: `/api/briefs` validates payloads, generates strategy text, persists records, and triggers integrations.
- **Data flow**:
  1. Client fills 5-step form.
  2. Draft is saved to `localStorage` between steps.
  3. Final submit posts to `/api/briefs`.
  4. Server validates input and generates strategic brief sections.
  5. Record is persisted (Supabase if configured, in-memory fallback for local dev).
  6. Email + Notion + Trello integrations run in modular service functions.
  7. `/admin` fetches submitted records for copy/export/delete.
- **Integrations**: Each integration checks env vars and silently skips if not configured, so setup can happen incrementally.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build / production checks

```bash
npm run lint
npm run build
npm start
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import project in Vercel.
3. Add environment variables from `.env.example` in Vercel Project Settings.
4. Deploy.

## Integration setup

### Gmail / SMTP
- Use Gmail SMTP (`smtp.gmail.com`) and a Google App Password.
- Set `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `NOTIFY_EMAIL`.

### Notion
- Create an internal Notion integration and copy API key to `NOTION_API_KEY`.
- Create/share a database with the integration and set `NOTION_DATABASE_ID`.

### Trello
- Generate Trello API key and token.
- Create/select list and set `TRELLO_LIST_ID`.

## Supabase setup (optional)

Create a `briefs` table:

```sql
create table briefs (
  id uuid primary key,
  created_at timestamptz not null,
  brand_name text not null,
  data jsonb not null
);
```

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## Suggested v2 improvements

- AI-enhanced strategy polishing with approval workflow.
- Role-based admin auth and audit logging.
- PDF/Google Docs export templates.
- Dashboard analytics by industry, market, and objective.
- Webhook integrations (Slack, Asana, Monday).
