# Shariki: frontend

React 19 + Vite SPA for the Shariki real-estate platform (buy, rent, or co-own a share of a property).
Talks to the Laravel API in `../backend`. English and Arabic (RTL).

## Setup

```bash
cp .env.example .env.local   # then adjust VITE_API_URL if needed
npm install
npm run dev                  # http://localhost:5173
```

The backend only allows CORS from ports 5172–5175 (`backend/config/cors.php`), so keep the dev server on one of those.

Demo data: run `php artisan db:seed` in `../backend`. Demo login: `rama@shariki.test` with the password set as `DEMO_USER_PASSWORD` in `backend/.env` (copy `.env.example` to `.env` in both folders first).
(admin: `admin@example.com` / `Admin1234`). If the API is down or empty, the public pages fall back to
`src/data/demoProperties.json`, the same data the seeder uses.

| Script               | What it does                                       |
| -------------------- | -------------------------------------------------- |
| `npm run dev`        | Dev server with HMR                                |
| `npm run build`      | Production build into `dist/`                      |
| `npm run lint`       | ESLint                                             |
| `npm run i18n:check` | Fails if `en.json` and `ar.json` have different keys |

## Structure

```
src/
  main.jsx              entry: i18n, global styles, <App />
  app/
    App.jsx             providers + router
    router.jsx          route table (pages are lazy-loaded) + redirects from old URLs
    routes.js           ROUTES constants: always link with these, never string literals
  api/                  one module per backend resource; all calls go through client.js
  context/              AuthProvider (session + profile), ToastProvider
  hooks/                useAuth, useToast, useAsync, useNotifications, usePropertyText, …
  lib/                  pure helpers: property.js, format.js, session.js, echo.js, errors.js
  components/
    ui/                 generic building blocks (Modal, Select, Tabs, EmptyState, …)
    layout/             SiteLayout, AdminLayout, Header, Footer, menus
    property/           PropertyCard, PricePanel, RequestModal, …
    account/ auth/      feature components
    routing/            RequireAuth (guards), ScrollManager, redirects
  pages/
    public/             Home, Properties, PropertyDetails, About, Auth, NotFound
    account/            ListProperty, MyRequests, MyProperties, Profile   (login required)
    admin/              Overview, ListingApprovals, Contracts, Reports    (admin only)
  i18n/                 i18next setup + locales/en.json, locales/ar.json
  styles/               base.css (tokens, reset), components.css, pages.css
  data/                 demo properties
```

## Conventions

- **API calls** go through `src/api`, never `fetch` in a component. `client.js` adds the token, parses JSON
  and throws `ApiError` (`status`, `errors` for Laravel validation). A 401 signs the user out.
- **Auth**: `useAuth()` gives `user`, `isLoggedIn`, `isAdmin` (from the backend's `is_admin`), `login`, `logout`.
  Protect routes with `<RequireAuth />` / `<RequireAuth admin />` in `router.jsx`.
- **Text**: every visible string comes from `t("…")`. Add keys to both locale files and run `npm run i18n:check`.
  Arabic plurals need `_zero/_one/_two/_few/_many/_other`. Database values (cities, property types,
  feature names) are translated under `data.*` and fall back to the raw value.
- **RTL**: use logical CSS properties (`margin-inline-start`, `inset-inline-end`, `text-align: start`).
  Add `className="sh-flip"` to arrow/chevron icons. Wrap user-entered text in `<bdi>` or `dir="auto"`.
- **Styles**: class names are prefixed `sh-`. Colours, radii and fonts come from the tokens in `styles/base.css`.
- **Live notifications** need `VITE_PUSHER_KEY`; without it they're off and Pusher isn't loaded.
