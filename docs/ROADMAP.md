# Roadmap & open decisions

## Shipped (v0.1, static MVP)
- [x] 20 chapters in 6 parts, 100 original key ideas with "Try" exercises, chapter map page
- [x] 60 tactics (3 per chapter, build and break), filters by chapter, domain and goal, tickable steps
- [x] Habit-journal design: light paper and night-journal themes, compounding-curve hero, animated habit tracker, GSAP + Lenis motion, reduced-motion support
- [x] Habit Coach: 12 AI options (bring your own key, no key, on device, self-hosted), local retrieval, idea-citation verification, manual-only mode
- [x] 30-second podcast: Kokoro on device plus Gemini/OpenAI/ElevenLabs keys, chime intro, MP3 download
- [x] Community habit journals preview (stored in the browser), relay with tests
- [x] Deploy configs: Cloudflare Pages (Function relay), Vercel (relay project `atomichabits-relay`), GitHub Pages workflow

## Decisions needed from the owner
1. **Brand and domain.** Working name *1% Field Manual*. Avoid "Atomic Habits" in the brand or domain (the author's mark); describing the site as an unofficial companion is fine.
2. **Code licence** (MIT or AGPL, for example) before accepting contributions.
3. **Monetisation** (Cloudflare allows commercial use). Do not sell book summaries as a substitute for the book; link to the book instead.

## Phase 2: community
- [ ] Cloudflare D1 schema and `/api/posts`, `/api/ratings`, `/api/flags` Pages Functions
- [ ] GitHub and Google sign-in, public alias only
- [ ] Flag threshold auto-hide, admin queue, Turnstile on posting

## Phase 3
- [ ] Printable habit tracker and habit scorecard (PDF)
- [ ] Full Traditional Chinese interface (繁體中文) and AI answers
- [ ] Daily 30-second episode page, tactic packs (new manager, new parent, small business)
- [ ] Shared "series" navigation with the Sun Tzu site

## Known limits
- Free model names change often (OpenRouter `:free`, Gemini aliases); defaults are editable, and OpenRouter has a "Load free models" button.
- Kokoro first run downloads about 80 MB (q8, WASM). WebLLM needs WebGPU (desktop Chrome or Edge).
