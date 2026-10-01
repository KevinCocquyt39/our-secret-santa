# 🎄 Our Secret Santa

A cozy, festive Secret Santa organizer built with Nuxt 3.

## Phase 1 (current): localStorage

Everything — sessions, guests, draws, wishlists — is stored in the browser's `localStorage`. No backend required. Great for testing the full flow before wiring up real persistence.

### How it works

1. **Sessions** (`/`) — create a new gift exchange by naming it and listing guests, or open an existing session.
2. **Who are you?** (`/sessions/:id`) — pick your name from the guest list. Use "Edit guests & name" to rename the session or change the guest list (this resets everyone's draw, but keeps wishlists for guests that still exist).
3. **Gift exchange** (same page, once you've picked your name) —
   - Draw your Secret Santa with one click. Once drawn, that guest can no longer be drawn by anyone else.
   - Click the reveal button to see your recipient's wishlist and follow the shop links.
   - Manage your own wishlist (title + external shop link) so your Secret Santa knows what to get you.

### Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Roadmap

- **Phase 2** — replace the `stores/sessions.ts` localStorage layer with a Firebase-backed data layer, queried through Drizzle ORM.
- **Phase 3** — CI/CD pipeline (GitHub Actions) that builds and deploys the app to Appwrite Sites on every push to `main`.
