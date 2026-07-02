# Market Better — Client Onboarding Form

A multi-step onboarding form built with Vite, React, TypeScript, shadcn-ui and Tailwind CSS. Submissions are sent to a Supabase Edge Function, forwarded to an n8n webhook, logged in Postgres, and notified to Slack with a link to a branded, shareable response page that SDRs can review with clients.

## Local development

Requirements: Node.js 18+ and npm.

```sh
npm install
cp .env.example .env   # fill in the values below
npm run dev
```

### Environment variables (frontend)

Create a `.env` file (or configure these in Vercel → Project Settings → Environment Variables):

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL, e.g. `https://xxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ref (used by the Supabase CLI) |

These are safe to expose client-side — they are the public anon key, not the service role key.

## Deploying to Vercel

1. Push this repo to GitHub/GitLab and import it in [vercel.com](https://vercel.com/new).
2. Framework preset: **Vite**. Build command `npm run build`, output directory `dist` (Vercel detects these automatically).
3. Add the three `VITE_*` environment variables above in the Vercel project settings.
4. Deploy. `vercel.json` already rewrites all routes to `index.html` for client-side routing.

## Supabase Edge Functions

The functions in `supabase/functions` run on Supabase, not Vercel — deploy them from the Supabase CLI:

```sh
supabase functions deploy submit-form
supabase functions deploy view-submission
supabase functions deploy daily-health-check
```

### Function environment variables (set in Supabase → Project Settings → Edge Functions)

| Variable | Used by | Description |
| --- | --- | --- |
| `SUPABASE_URL` | all | Auto-provided by Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `submit-form`, `view-submission` | Auto-provided by Supabase |
| `SLACK_BOT_TOKEN` | `submit-form`, `daily-health-check` | Slack bot token (`xoxb-...`) with `chat:write` scope |
| `SLACK_NOTIFY_USER_ID` | `submit-form`, `daily-health-check` | Slack user/channel ID to DM on errors / health checks |
| `SLACK_NOTIFICATION_DESTINATION` | `submit-form` | Slack channel ID for the "new submission" notification |
| `SUPABASE_ANON_KEY` | `daily-health-check` | Anon key, used to ping `submit-form` |

`view-submission` is deployed with `verify_jwt = false` (see `supabase/config.toml`) so the shareable response link opens directly in a browser without any auth headers — it's gated only by the unguessable submission ID.

## What's in the app

- `src/components/onboarding` — the 8-step onboarding form.
- `supabase/functions/submit-form` — receives submissions, retries the n8n webhook, logs to `submission_logs`, and notifies Slack with a link to the branded response page.
- `supabase/functions/view-submission` — renders that response as a standalone, brand-styled HTML page (purple/orange Market Better palette, grouped by topic, print/PDF friendly) so an SDR can review it live with a client.
- `supabase/functions/daily-health-check` — periodic check that `submit-form` and the n8n webhook are reachable.
