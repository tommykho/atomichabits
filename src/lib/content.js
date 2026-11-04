// Build-time content loader. Merges the book outline, chapter ideas (original summaries) and tactics.
// Nothing here reproduces the book: ideas and tactics are original writing, cited by idea ID ("5.3").
import book from '../../data/book.json';
import { u } from './url.js';

const chapterFiles = import.meta.glob('../../data/chapters/ch*.json', { eager: true, import: 'default' });
const tacticFiles = import.meta.glob('../../data/tactics/ch*.json', { eager: true, import: 'default' });
const lensByN = new Map(Object.values(chapterFiles).map((c) => [c.n, c]));

export const BOOK = { title: book.book, author: book.author, year: book.year, note: book.note };

export const DOMAINS = {
  work: { label: 'Work' },
  career: { label: 'Career' },
  business: { label: 'Business' },
  health: { label: 'Health' },
  family: { label: 'Family' },
  self: { label: 'Self' },
};
export const MODES = { build: 'Build a habit', break: 'Break a habit' };

export const parts = book.parts;
const partByN = new Map(parts.flatMap((p) => p.chapters.map((n) => [n, p])));

export const tactics = Object.values(tacticFiles)
  .flat()
  .sort((a, b) => a.chapter - b.chapter || Number(!!b.featured) - Number(!!a.featured));

export const chapters = book.chapters.map((c) => {
  const lens = lensByN.get(c.n) || {};
  const part = partByN.get(c.n);
  return {
    n: c.n,
    title: c.title,
    short: lens.short || '',
    part,
    essence: lens.essence || '',
    modern_lens: lens.modern_lens || '',
    key_idea: lens.key_idea || `${c.n}.1`,
    ideas: (lens.ideas || []).map((i) => ({ ...i, ch: c.n })),
    tactics: tactics.filter((t) => t.chapter === c.n),
  };
});

export const ideaMap = new Map(chapters.flatMap((c) => c.ideas.map((i) => [i.id, i])));
export const getIdea = (id) => ideaMap.get(id);
export const chapterOf = (n) => chapters[n - 1];
export const ideaAnchor = (id) => `i${id.replace('.', '-')}`;
export const ideaHref = (id) => u(`/chapters/${id.split('.')[0]}/#${ideaAnchor(id)}`);
export const pad = (n) => String(n).padStart(2, '0');

export function relatedTactics(t, limit = 3) {
  const score = (o) => (o.domain === t.domain ? 2 : 0) + (o.chapter === t.chapter ? 1 : 0) + (o.mode === t.mode ? 1 : 0) + o.tags.filter((x) => t.tags.includes(x)).length;
  return tactics
    .filter((o) => o.slug !== t.slug)
    .map((o) => [score(o), o])
    .sort((a, b) => b[0] - a[0])
    .slice(0, limit)
    .map(([, o]) => o);
}

export const featured = tactics.filter((t) => t.featured);

// Compact corpus shipped to the browser for retrieval and citation checking.
export function corpus() {
  return {
    v: 1,
    chapters: chapters.map((c) => ({ n: c.n, title: c.title, short: c.short, part: c.part.label, rule: c.part.rule, essence: c.essence, key: c.key_idea })),
    ideas: chapters.flatMap((c) => c.ideas.map((i) => ({ id: i.id, name: i.name, text: i.text, try: i.try }))),
    tactics: tactics.map((t) => ({
      slug: t.slug,
      title: t.title,
      situation: t.situation,
      domain: t.domain,
      mode: t.mode,
      tags: t.tags,
      chapter: t.chapter,
      principle: t.principle,
      ideas: t.ideas,
      moves: t.moves.map((m) => m.title),
      scene: t.scene,
      script: t.script,
      backfire: t.backfire,
    })),
  };
}
