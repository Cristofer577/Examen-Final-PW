# AGENTS.md

## Project

Angular 22 standalone app ("Comedor Solidario", Spanish UI for a community kitchen) connected to a FastAPI backend.

- Bootstrap: `src/main.ts` -> `app.config.ts` (router + `provideHttpClient` with `authInterceptor`) -> `App` (`<router-outlet>`).
- API base URL: `src/environments/environment.ts` -> `environment.apiUrl` (`http://127.0.0.1:8000` by default). All JSON is camelCase and dates are ISO `YYYY-MM-DD`.
- Routes (`src/app/app.routes.ts`): `/login` is public; `/inicio`, `/beneficiarios`, `/raciones`, `/inventario`, `/reportes` render inside `MainLayout` behind `authGuard`. Note `/raciones` maps to `components/pages/raciones-diarias/`.
- `core/sesion.ts` stores the JWT and user in signals + `localStorage` (`comedor.token`, `comedor.usuario`).
- `core/http/auth-interceptor.ts` adds `Authorization: Bearer <token>` only to `environment.apiUrl` requests and clears the session + redirects to `/login` on 401 (except `/auth/login`).
- `core/http/errores.ts` normalizes `HttpErrorResponse` errors; status 0 means the backend is unreachable.
- `core/auth-guard.ts` lets navigation pass only when `Sesion.estaAutenticado()` is true.
- `services/auth.ts` (`AuthService`) performs `POST /auth/login` and logout. Login form validates with Signal Forms and shows loading/error states.
- Data services (`beneficiario`, `inventario`, `racion`, `reporte`, `resumen`) are root-provided, hold `signal` state plus `cargando`/`error`, and call the API with `HttpClient`:
  - `GET|POST /beneficiarios`, `PUT|DELETE /beneficiarios/{id}`
  - `GET|POST /inventario`, `PUT|DELETE /inventario/{id}`
  - `GET|PUT /raciones/{fecha}`
  - `GET /reportes/raciones?desde=&hasta=`
  - `GET /resumen?fecha=`
- `components/pages/<feature>/` owns page state and page-local modal forms; `components/shared/` holds presentational components (including `estado-panel` for loading/error/retry); `core/layout/` holds sidebar/header/main-layout; `models/` holds interfaces plus small pure helpers (e.g. `estadoAlimento`).
- Demo users: `10458921 / demo123` (Encargada General) and `socia.turno / demo123` (Socia de Turno).
- `src/app/data/*.data.ts` are leftover demo datasets: `beneficiarios.data.ts`, `alimentos.data.ts` and `reportes.data.ts` are no longer imported. `raciones.data.ts` keeps `MOVIMIENTOS_HOY` for the Inicio mock section and an unused `META_DIARIA`.

## Commands

```bash
npm install
npm start                                # ng serve, http://localhost:4200
npm run build                            # production by default -> dist/mi-proyecto
npm test                                 # Vitest via @angular/build:unit-test (jsdom)
npx tsc -p tsconfig.app.json --noEmit    # typecheck; no script exists
npx prettier --write <files>             # no format/lint script; config in .prettierrc
```

- Single spec: `npm test -- --watch=false --include "<absolute path to spec>"`.
- There is no lint target and no e2e target; the README's `ng e2e` does not work. README is mostly Angular CLI boilerplate.

## Conventions

- Standalone components only (no NgModules), using `input()`, `output()`, `inject()`, `signal()`, `computed()`. Do not introduce constructor injection or `standalone: true`.
- Forms use Angular 22 **signal forms** from `@angular/forms/signals` (`form`, `FormField`, `required`, `min`, `pattern`, `submit`) bound with `[formField]`. Do not use `ReactiveFormsModule`/`FormsModule`.
- Never put `required`, `min`, `max`, `maxlength` or `pattern` as HTML attributes on a `[formField]` control (NG8022). Declare validators only inside `form()`.
- Every API-backed screen must show a loading state and an error state with a **Reintentar** button, using `components/shared/estado-panel/` and `mensajeError()` from `core/http/errores.ts`.
- Mutations (create/update) return `Observable` so the page can show 409/422 `detail` errors inside its modal (`errorRemoto` input on the form components).
- UI text, identifiers, and comments are Spanish; dates use `es-PE` and ISO `YYYY-MM-DD` in data/models. Use `core/fechas.ts` (`fechaISO`) for query dates.
- Reuse global utility classes/tokens from `src/styles.css` (`.card`, `.btn-primario`, `.btn-secundario`, `.btn-peligro`, `.input`, `.badge-*`, CSS variables) instead of redefining shared styles per component.
- Prettier: 2-space indent, single quotes, print width 100, Angular parser for HTML.

## Gotchas

- **Test discovery is broken on this machine**: the folder on disk is `Comedor-solidario-Frontend` (capital F) while the workspace/cwd is `...-frontend`. Vitest resolves the real path but the CLI globs the lowercase path, so `npm test` exits 1 with "No test files found". Pass an absolute spec path spelled with the on-disk casing, e.g.:
  `npm test -- --watch=false --include "C:/Users/User/Documents/Examen Final PW/Comedor-solidario-Frontend/src/app/app.spec.ts"`
- Running many spec files in one invocation can time out while spawning Vitest forks workers on this machine. Prefer one spec at a time, or two small ones.
- The full generated suite is still not green: `app.spec.ts` (stale title assertion) and several shared/layout specs still fail for pre-existing reasons. Specs touched for the API integration now provide `provideHttpClient`, `provideHttpClientTesting` and `provideRouter`, and pass. Do not "fix" unrelated pre-existing failures as part of feature work.
- PowerShell execution policy blocks `npm.ps1` and `npx.ps1` here, so bare `npm`/`npx` fail in the shell. Prefix with `cmd /c` (e.g. `cmd /c "npm test -- --watch=false"`) or call `node node_modules/<pkg>/...` directly.
- Production budgets: initial 500 kB warning / 1 MB error, any component style 4 kB warning / 8 kB error.
- `environment.ts` currently points only to local development (`http://127.0.0.1:8000`). There is no production environment/replacement yet.
