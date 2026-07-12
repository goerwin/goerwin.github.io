# goerwin.github.io

Personal website built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [Tailwind CSS](https://tailwindcss.com/).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production (includes CV PDF generation) |
| `npm run lint` | Check with Biome |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format with Biome |

## Deployment

Pushes to `main` trigger a [GitHub Actions workflow](.github/workflows/deploy.yml) that builds the site and deploys the `out/` folder to [GitHub Pages](https://pages.github.com/).
