# Dashmin (Angular)

The **Dashmin** admin template was recreated as a modern Angular application.
It keeps the look & feel of the original static template (Bootstrap 5 + the
customized `css/style.css` theme) but only exposes **two** pages: **Home** and
**About**.

```
dashmin-1.0.0/
├── css/ js/ img/ lib/      <- assets of the original template
├── public/                 <- favicon
├── scripts/ng-cli.cjs      <- helper used by "npm test"
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.scss
    └── app/
        ├── app.ts / app.html / app.css   <- root component (router outlet)
        ├── app.routes.ts                  <- routes
        ├── layout/                        <- sidebar + navbar (the shell)
        └── components/
            ├── home/                      <- dashboard page
            └── about/                     <- about page
```

## Run it

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build in dist/dashmin
npm test           # unit tests (vitest)
```

## How the sidebar stays loaded

The sidebar is **not** part of the pages, it belongs to the layout:

```
src/app/app.routes.ts
│
└── path: ''                → <app-layout>   (sidebar + navbar + footer)
    ├── path: 'home'        → <app-home>     (lazy loaded)
    └── path: 'about'       → <app-about>    (lazy loaded)
```

`app.html` only renders a `<router-outlet />`, the router replaces it with the
`Layout` component, and the layout contains the sidebar plus a second
`<router-outlet />` where the pages are swapped. Because the layout is the
**parent route**, it is instantiated once and is never destroyed while the user
navigates between *Home* and *About* – the sidebar is always on screen, and the
active link is highlighted with `routerLinkActive`.

Both pages are lazy loaded (`loadComponent`), so the shell of the dashboard is
painted before the content of a route arrives.

## Assets

The original template files are reused as they are:

| File                     | Usage                                              |
| ------------------------ | -------------------------------------------------- |
| `css/bootstrap.min.css`  | Bootstrap 5 (bundled through `angular.json`)       |
| `css/style.css`          | customized theme of the template (bundled too)     |
| `img/`                   | user avatar / testimonials (copied to `dist`)      |
| `lib/chart/chart.min.js` | Chart.js, loaded globally and used by the Home page |

## Notes

* The navbar dropdowns and the mobile sidebar toggle are handled with Angular
  signals, no jQuery and no Bootstrap javascript plugin are needed.
* `npm test` runs the Angular CLI through `scripts/ng-cli.cjs`, it disables the
  parallel TypeScript compilation because the unit-test builder cannot spawn
  its worker thread on every Windows machine (`EINVAL`).
* The static demo pages of the original template (`index.html`, `chart.html`,
  …) are still in the project root and can be opened directly in a browser.
