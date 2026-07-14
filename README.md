# My Economy

A personal economics dashboard — a tiny real app for learning **Next.js**, **Supabase**, **Vercel**, and **vibe coding**, built to grow alongside an economics degree.

It starts as a simple personal ledger (income, spending, balance). Every economics topic you learn in school can become a new feature. The roadmap is at the bottom.

---

## What's in the box

```
my-economy/
├── app/
│   ├── layout.js        ← outer shell of every page
│   ├── page.js          ← the home page (the whole app for now)
│   └── globals.css      ← all styling, plain CSS
├── lib/
│   └── supabase.js      ← connection to the database
├── supabase/
│   └── schema.sql       ← run this once in Supabase to create the table
├── .env.local.example   ← template for your secret keys
└── package.json         ← project dependencies
```

Only ~3 files of real code. Read all of them — they're heavily commented.

---

## Step 1 — Run it on your computer (5 min)

You need [Node.js](https://nodejs.org) installed (LTS version).

```bash
cd my-economy
npm install
npm run dev
```

Open http://localhost:3000. The app runs in **demo mode** with sample data — nothing is saved yet. That's fine; explore the UI and the code first.

## Step 2 — Connect a real database with Supabase (15 min)

1. Go to [supabase.com](https://supabase.com), sign up (free), create a new project.
2. In the left sidebar open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and click **Run**. This creates the `transactions` table.
3. Go to **Project Settings → API** and copy two values: the **Project URL** and the **anon public key**.
4. In the project folder, copy `.env.local.example` to `.env.local` and paste your values in.
5. Restart the dev server (`Ctrl+C`, then `npm run dev` again).

The demo banner disappears — transactions now survive a refresh. Open **Table Editor** in Supabase and watch rows appear as you add them. That "aha" moment is the whole point.

## Step 3 — Publish it to the world with Vercel (10 min)

1. Push the project to a GitHub repository (create a free account if needed).
2. Go to [vercel.com](https://vercel.com), sign in with GitHub, click **Add New → Project**, and pick your repo.
3. Under **Environment Variables**, add the same two values from `.env.local`.
4. Click **Deploy**. In about a minute you get a public URL like `my-economy.vercel.app`.

From now on, every `git push` automatically redeploys. Show it to friends on their phones.

## Step 4 — Vibe code your first change (10 min)

Open the project in an AI coding tool (Claude, Cursor, etc.), or just paste `app/page.js` into a chat, and ask in plain English. Good first prompts:

- "Add a filter so I can view transactions from one category only."
- "Show what percentage of my spending goes to each category."
- "Add a monthly budget field and warn me when spending exceeds it."

Read the diff before accepting it. Ask the AI "explain what you changed and why" — that's where the learning happens.

---

## The learning roadmap: economics class → app feature

Each row is a weekend-sized project. In rough order of difficulty:

| Economics concept | Feature to build | New skill learned |
|---|---|---|
| Budget constraint | Monthly budget with progress bar | React state & conditional UI |
| Opportunity cost | "If I skipped this, I could have…" note per expense | Editing table schema (add column) |
| Consumption categories | Pie chart of spending by category | A chart library (e.g. recharts) |
| Inflation / real vs nominal | Inflation calculator page (CPI-adjusted values) | Adding a second page & routing |
| Savings & compound interest | Savings goal with compound-growth projection | Math in JS, line charts |
| Supply & demand | Interactive supply/demand curve with sliders | SVG / interactive graphics |
| Exchange rates | Show spending in SGD/USD/EUR using a live API | Fetching external APIs |
| Time series / GDP | Chart real GDP data from a public dataset | Data import, aggregation queries |
| Behavioral economics | "Spending mood" tag; correlate mood with spending | Simple data analysis |
| Multi-user economy | Login with Supabase Auth; each user has own ledger | Authentication & RLS policies |

The last one is the big graduation project: it turns "My Economy" into "Our Economy" — and teaches the security model (Row Level Security) that real apps depend on.

## House rules for learning together

1. **Vibe code, then read.** The AI writes; you both read what changed before moving on.
2. **One feature per branch.** `git checkout -b feature/pie-chart` — learn git the natural way.
3. **Break it on purpose.** Delete a line, watch the error, fix it. Errors are teachers.
4. **The database is a first-class citizen.** After each feature, look at the table in Supabase and ask: could SQL compute this summary instead of JavaScript?

https://supabase.com/dashboard/new/whowjifqtsegslbkqcoe?projectName=dongshan2014%27s%20Project
db password: raoCPO1dS6J6Oxz2 (supabase project: Student Project)
project ID: rcfnrgtqvxffccepviqv
public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZm5yZ3RxdnhmZmNjZXB2aXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MjY3NDUsImV4cCI6MjA5OTUwMjc0NX0.8mXJG-Vm4HI4kMk8SRmKqmokLhuZjCa5YIjQVOrhGv8


=================================steps for setup in another laptop================================================
# 0. Prerequisites
#    - Install Node.js LTS from nodejs.org
#    - git: run  git --version  — if missing, macOS prompts to install
#      developer tools (or run: xcode-select --install)

# 1. Identity (who her commits belong to)
git config --global user.name  "her-github-username"
git config --global user.email "her-email@example.com"
git config --global init.defaultBranch main

# 2. Get the project — clone REPLACES init/add/commit/remote-add.
#    It downloads the repo WITH full history and the origin remote pre-configured.
git clone https://github.com/dongshan2014/my-economy.git
cd my-economy

# 3. Restore dependencies (rebuilds node_modules for macOS/ARM)
npm install

# 4. Secrets — create .env.local (you send her the two values privately)
cp .env.local.example .env.local
#    ...then edit .env.local with the real URL and anon key

# 5. Run it
npm run dev        # → http://localhost:3000

Plus the two things from the previous message: she creates her GitHub account, 
and you add her as collaborator (repo → Settings → Collaborators). 
Without that, step "push" below gets rejected with a 403.


# Daily loop
git pull                          # 1. FIRST — get Papa's latest changes
npm run dev                       # 2. work: edit, vibe-code, test locally
git status                        # 3. see what changed
git add .                         # 4. stage everything changed
git commit -m "Add inflation calculator page"   # 5. snapshot locally
git push                          # 6. upload → GitHub → Vercel auto-deploys

# create a new project by own:
When would she need her own Vercel account and repo? Later, when she starts a project that's hers — say "My Economy v2" as her own portfolio piece, or a coursework project. Then she repeats what you did this week: git init, create repo under her account, sign up to Vercel (Hobby, via her GitHub), import, deploy. Doing that solo once is actually a great graduation exercise — she'll discover she remembers the whole pipeline. But for the shared family project: your repo, your Vercel, her push access is all it takes.


