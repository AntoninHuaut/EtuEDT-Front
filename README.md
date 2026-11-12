# EtuEDT-vue3

## Project setup

### Installs dependencies

```
pnpm install
```

### Setup .env file

```
cp .env.exemple .env
```

### Compiles and hot-reloads for development

```
pnpm dev
```

### Compiles and minifies for production

```
pnpm build
```


## Feature availability

`VITE_OPTIONAL_FEATURES_ENABLED` defaults to `true`. Set it to `false` and set
`VITE_FEATURE_UNIVERSITY_IDS` to a comma-separated list of university IDs to disable
calendar synchronization, direct calendar link copying, and free-room search for
those universities. Timetable and room browsing remain available. Other universities
are unaffected, and an empty ID list applies no restrictions.

These are Vite build-time settings: restart the dev server or rebuild the frontend
after changing them. Invalid values are rejected at application startup. Set the flag
back to `true` to restore the actions. The flags control the interface; the backend
must independently enforce feature availability.

Run `pnpm test` to check the feature policy and `pnpm build` for type checking and
the production build.
