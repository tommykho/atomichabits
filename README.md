# 1% Field Manual

*Tiny habits, applied to real work and life.* An unofficial companion to the ideas in **Atomic Habits** by James Clear (2018).

A static website that turns the book's 20 chapters into practical habit tactics for work, career, business, health, family and self. It is a sister project of [Sun Tzu · Modern Field Manual](https://github.com/tommykho/suntze) and uses the same stack, features and deployment model. It includes:

- **The book, mapped**: the Fundamentals, the Four Laws (and their inversions) and Advanced Tactics. Every chapter has 5 numbered **key ideas** (100 in total), written in plain words for this project, each with a one-line "Try" exercise.
- **Tactic library**: 60 tactics (3 per chapter), filterable by chapter, domain and build/break. Each has a scene, idea citations, a step-by-step system with tickable steps, a ready-to-use script, a backfire check and signs that it is working.
- **Habit Coach (AI)**: describe a habit to start or stop and get your habit loop, a four-law system, a script and a backfire check. Every `[chapter.idea]` citation is checked against the dataset: exact phrases, paraphrases and invented IDs are labelled.
- **30-second podcast**: the plan becomes a spoken script, voiced on your device (Kokoro-82M) or with your own TTS key, with a soft chime intro, and downloaded as an MP3.
- **Community habit journals** (preview): post the habit you built or broke, rate others' entries, flag unhealthy ones. Phase 2 adds accounts and shared storage.
- **Habit-journal design**: paper, ruled index cards, washi tape and handwriting, with light and dark ("night journal") themes, GSAP + Lenis scroll motion and reduced-motion support.

**Cost to the site owner: $0.** The site is static. AI and voice run on the visitor's device or on the visitor's own provider key. The only server code is a small stateless CORS relay.

## Copyright and trademark

*Atomic Habits* is a copyrighted book, and the name is the author's mark. This project:

- does **not** reproduce any text from the book (chapter titles are listed for navigation only);
- writes all chapter summaries, key ideas and tactics in original words, and cites them by ID;
- uses a distinct brand (*1% Field Manual*) and states that it is unofficial and unaffiliated;
- tells the AI never to quote the book, and only verifies citations against this project's own idea summaries.

Do not add book excerpts, scans or PDFs to this repository. See [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md).

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # validates content, then builds to dist/
npm test           # relay unit tests
```

Node 20+ is required.

## AI providers (bring your own key)

| Provider | Cost to visitor | Route |
|---|---|---|
| Puter.js | free, no key (Puter sign-in) | browser |
| WebLLM on-device | free, no key, about a 2 GB download | browser (WebGPU) |
| OpenRouter `:free` models | free key | browser |
| Google Gemini | free key | browser (relay fallback) |
| Groq · Mistral · Cerebras · GitHub Models | free keys | browser (relay fallback) |
| NVIDIA NIM | free key | relay (NVIDIA blocks browsers) |
| Anthropic Claude | paid key | browser (official SDK) |
| Meta Muse Spark | paid key (public preview) | relay |
| Custom OpenAI-compatible, e.g. Ollama on your NAS | free | browser |

Podcast voice: Kokoro-82M on the device (default, free) · Gemini TTS · OpenAI TTS · ElevenLabs (visitor's key).

## Project layout

```
data/            book.json (parts + chapter titles), chapters/ (ideas), tactics/, community-demo.json
scripts/         validate-content.mjs (schema, idea-ID and no-long-quote checks)
src/pages/       index, chapters/, chapters/[n], tactics/, tactics/[slug], coach, community, about, corpus.json
src/scripts/     motion.js (GSAP + Lenis, theme) · field/* (providers, retrieval, prompt, tts, worker) · community.js
server/          relay-core.js (portable) · node-relay.mjs (NAS / self-host)
functions/api/   relay.js (Cloudflare Pages Function)
api/             relay.js (Vercel Function)
docs/            ARCHITECTURE · DEPLOY · ROADMAP · CONTENT-GUIDE
```

## Deploy

Cloudflare Pages (primary, free, commercial use allowed) · Vercel (relay, optional full site) · GitHub Pages (test site).
Steps: [docs/DEPLOY.md](docs/DEPLOY.md).

## Licences

Code: add your preferred licence before accepting contributions. Original content (summaries, tactics) © the project owner.
Third-party credits are on the About page.
