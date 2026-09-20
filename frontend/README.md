# Frontend clients

Two clients, both happy-path only, both talking to the `backend` API
(POST /rules, GET /rules) shared with the earlier scaffold.

## web/ — mweb + dweb, one codebase

React + Vite + TypeScript. The same build serves both mobile web and
desktop web — layout switches via a single CSS media query
(`src/index.css`), there's no separate mobile/desktop build.

```bash
cd web
npm install
npm run dev      # http://localhost:5173
```

Set `VITE_API_BASE_URL` (e.g. in a `.env` file) if your backend isn't on
`http://localhost:3000`.

## mobile/ — native app (iOS + Android)

Expo + React Native + TypeScript, SDK 56. Same form/list functionality as
the web client, native components instead of DOM.

```bash
cd mobile
npm install
npm start         # opens Expo dev tools; scan the QR with Expo Go
```

The API base URL is set in `app.json` under `expo.extra.apiBaseUrl` —
change it there rather than hardcoding it in `src/api.ts`.

## Deliberately NOT here yet

Same spirit as the backend README:
- No auth — `userId` is hardcoded to `"cat-eyes"` in both clients
- No real date/time picker on either client (web uses the native
  `datetime-local` input; mobile takes a raw text string)
- No error UI — failures just log to console
- No loading/empty states beyond the bare minimum
- No shared types package — `types.ts` is duplicated across
  `backend/`, `web/`, and `mobile/` by hand. Worth extracting into a
  shared workspace package once the duplication starts causing drift.
- No push notifications wired into the mobile client itself (the
  backend's notification service currently just logs — connecting real
  FCM delivery to the mobile app is separate work)
