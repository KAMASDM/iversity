# iVersity — AI-powered learning platform

A learning management system built with React 19, Vite, Firebase (Auth + Firestore) and Netlify Functions.
Students work through structured courses (chapters → lessons → chapter quizzes → final exam), get help from
**Buddy**, an AI tutor grounded in the course content, and earn verifiable certificates.

## Features

- **Course room** — reading or slide view, resume where you left off, course outline with per-chapter progress,
  keyboard navigation (← →), notes, tasks, XP/badges and downloadable resources
- **Chapter quizzes** — one question at a time with instant feedback and explanations
- **Final exam** — unlocks when every lesson is complete; graded on the server; 70% to pass
- **Certificates** — issued by the server only, printable, with a public verification page (`/verify/:id`)
- **Buddy** — AI tutor (OpenAI `gpt-4o-mini`) that knows the current lesson; can generate interactive quizzes;
  chat history saved per course
- **Personalised plan** — optional AI study plan from a short enrollment questionnaire
- **Admin** — course creation/editing, content upload, student management, seed-data importer

## Architecture

```
src/                      React app (code-split per route)
  pages/                  Admin, Student, Auth and Public pages
  components/course/      Course room building blocks (outline, quiz, markdown, slides, video)
  services/               Firestore data access, auth, AI/API clients (no secrets)
  seedData/               Course content + seed scripts
netlify/
  functions/buddy.js      AI tutor chat + quiz generation
  functions/ai.js         Questionnaire, personalised curriculum, adaptive quizzes
  functions/final-exam.js Builds, grades and certifies the final exam
  lib/server.js           Shared auth (Firebase ID token), rate limiting, OpenAI wrapper
firestore.rules           Security rules — completion/certificate fields are server-only
firestore.indexes.json    Composite indexes used by the app's queries
```

All AI calls and certificate issuing happen in Netlify Functions. Every function requires a signed-in user with a
verified email (`Authorization: Bearer <Firebase ID token>`). No API keys are shipped to the browser.

## Local development

```bash
npm install
npm run dev          # Vite only — UI works, AI/exam calls need the functions
npx netlify dev      # Vite + Netlify Functions together (recommended)
```

### Environment variables

`.env` (browser — these Firebase web keys are public by design; access is enforced by `firestore.rules`):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Netlify site environment (server-only — never prefix these with `VITE_`):

| Variable | Used by | Notes |
|---|---|---|
| `OPENAI_API_KEY` | buddy, ai | Required for AI features |
| `FIREBASE_PROJECT_ID` | all functions | Falls back to `VITE_FIREBASE_PROJECT_ID` |
| `FIREBASE_CLIENT_EMAIL` | final-exam | From a Firebase service-account key |
| `FIREBASE_PRIVATE_KEY` | final-exam | Paste the key with `\n` line breaks; required to issue certificates |

## Deploying

1. Netlify builds the site and functions from `netlify.toml`.
2. Deploy Firestore rules and indexes whenever they change:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes
   ```
3. Admin accounts: everyone registers as a student. Promote a user by setting `role: "admin"` on their
   `users/{uid}` document in the Firebase console (students cannot change their own role).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint |
