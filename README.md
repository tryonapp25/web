# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

##
Command	Loaded env
- npm run dev	.env.development
- vite	.env.development
- npm run build	.env.production
GitHub Pages deploy	.env.production

- npm run deploy

Locize (managed translation)

This project supports optionally loading translations from Locize. To enable:

1. Install the Locize backend dependency:

```bash
npm install i18next-locize-backend
```

2. Set Vite env vars in `.env` or your hosting environment:

- `VITE_LOCIZE_PROJECTID` — your Locize project id (required to enable backend)
- `VITE_LOCIZE_APIKEY` — write API key (optional; required to push missing keys)
- `VITE_LOCIZE_REFERENCE_LNG` — reference language (default: `en`)
- `VITE_LOCIZE_VERSION` — project version (default: `latest`)

With those set the app will load translations from Locize at runtime and
fall back to local `src/i18n/locales/*.json` files when keys are missing.
