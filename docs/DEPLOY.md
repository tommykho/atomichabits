# Deploy — Cloudflare Pages + Vercel + GitHub Pages

Same model as the Sun Tzu project. One build works on all three hosts.

| Host | Role | URL |
|---|---|---|
| Cloudflare Pages | primary site + `/api/relay` (Pages Function) | `https://hopbit.pages.dev` (after setup) |
| Vercel | stand-alone relay for static hosts (optional: full site) | `https://hopbit-relay.vercel.app/api/relay` |
| GitHub Pages | test site, built by Actions | `https://tommykho.github.io/hopbit/` |

## 1. GitHub Pages (test site)

- Workflow: `.github/workflows/pages.yml` builds, tests and deploys on every push to `claude/pensive-cray-kiis8w` or `main`.
  The workflow runs `actions/configure-pages` first and passes its `base_path` and `origin` outputs as `BASE_PATH` and `SITE_URL`, so links follow the repo name (or a custom domain) automatically; `PUBLIC_RELAY_URL=https://hopbit-relay.vercel.app/api/relay`.
  `robots.txt` is generated at build time (`src/pages/robots.txt.js`), so its sitemap URL follows the host.
- **One-time setting:** repo **Settings → Pages → Build and deployment → Source: GitHub Actions**. Then re-run the workflow
  (Actions tab → *Deploy GitHub Pages* → *Run workflow*).

## 2. Vercel relay

- Project `hopbit-relay` (team scope as the Sun Tzu relay). Direct upload of `api/relay.js` + `server/relay-core.js`
  with a minimal `package.json` (`"type": "module"`), no Git link, framework *Other*, Vercel Authentication **off** (public).
- Env: `ALLOWED_ORIGINS=https://tommykho.github.io` (add more origins comma-separated if another static host uses it).
- To redeploy after changing the relay code, upload the same three files again (Vercel CLI: `vercel deploy --prod` from a folder
  containing them).
- **Optional, full site on Vercel:** import the repo in Vercel. `vercel.json` already sets the Astro build, `dist/` output and security
  headers, and `api/relay.js` serves `/api/relay` on the same origin. Note that Vercel Hobby is non-commercial only.

## 3. Cloudflare Pages (primary)

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → choose `tommykho/hopbit`.
2. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION = 22`
   - Production branch: `main` (or `claude/pensive-cray-kiis8w` until it is merged)
3. Deploy. The `functions/` folder is picked up automatically, so `/api/relay` goes live with the site (same origin, no extra config).
4. Optional: **Custom domains** → add your domain, then set `SITE_URL` in the project's build variables (or update `url` in `src/site.config.js`). `robots.txt` and the sitemap follow it automatically.
5. Optional: **Settings → Variables** → `ALLOWED_ORIGINS` if other origins must use this relay.

Protect the free quota: **Security → WAF → Rate limiting rules** (1 free rule): path `/api/relay`, 30 requests per minute per IP, Block.

### Why Cloudflare is primary

| | Cloudflare free | Vercel Hobby |
|---|---|---|
| Commercial use (ads, donations, paid tier) | ✅ allowed | ❌ non-commercial only |
| Static bandwidth | unlimited | 100 GB/month |
| Server functions | 100k requests/day | 1M invocations/month |
| Database for phase 2 | D1 (5 GB) | external |

## Local Cloudflare emulation (optional)

```bash
npm run build
npx wrangler pages dev dist     # serves the site and /api/relay together
```

## Hybrid with your NAS (optional)

- **Self-hosted model:** Ollama on the NAS with `OLLAMA_ORIGINS=https://your-domain`, exposed with `cloudflared tunnel`.
  Visitors choose **Custom / self-hosted** and enter `https://llm.your-domain/v1`.
- **Self-hosted relay:** `PORT=8787 ALLOWED_ORIGINS=https://your-domain node server/node-relay.mjs` behind the tunnel.
