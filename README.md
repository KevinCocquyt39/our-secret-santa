# 🎄 Our Secret Santa

A cozy, festive Secret Santa organizer built with Nuxt 3, backed by Firebase Firestore.

## Phase 2 (current): Firestore

Sessions, guests, draws, and wishlists live in a Firestore collection (`sessions`) and sync in real time across every device — no backend code to write, no login required.

### How it works

1. **Sessions** (`/`) — create a new gift exchange by naming it and listing guests, or open an existing session.
2. **Who are you?** (`/sessions/:id`) — pick your name from the guest list. Use "Edit guests & name" to rename the session or change the guest list (this resets everyone's draw, but keeps wishlists for guests that still exist).
3. **Gift exchange** (same page, once you've picked your name) —
   - Draw your Secret Santa with one click (runs as a Firestore transaction, so two people can't get the same recipient).
   - Click the reveal button to see your recipient's wishlist and follow the shop links.
   - Manage your own wishlist (title + external shop link) so your Secret Santa knows what to get you.

### Getting started

1. Copy `.env.example` to `.env` and fill in your Firebase web app config (Firebase console → Project settings → General → Your apps).
2. Make sure Firestore is enabled for your project and `firestore.rules` is deployed (`firebase deploy --only firestore`).
3. Install and run:

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

> ⚠️ The included `firestore.rules` are intentionally open (no auth exists yet in the app), so anyone with Firestore access can read/write any session. Fine for a private friends-and-family link; don't use it for anything more sensitive without adding auth first.

## Roadmap

- **Phase 3** — CI/CD pipeline (GitHub Actions) that builds and deploys the app to GitHub Pages / Appwrite Sites on every push to `main`.
