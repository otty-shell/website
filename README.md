# OTTY Website

This is the source code of the OTTY workspace website.

## Local development

Use Node.js 22.12 or newer and install the locked dependency graph:

```sh
npm ci
```

Start the development server with `npm run dev`.

## Production artifact

Run `npm run check`, `npm test`, and `npm run build`. The production build is written to `dist/`.
Inspect that artifact locally with `npm run preview`.
