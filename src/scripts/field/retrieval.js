import { BASE as B } from '../../lib/url.js';
// Local retrieval over the idea summaries + tactic library (no network, no key). Feeds the AI a short
// menu of ideas it is allowed to cite, and powers the "manual only" answer.
import MiniSearch from 'minisearch';

const STOP = new Set('a an and are as at be been but by can do does for from get got has have he her him his how i if in into is it its just me my of on or our she so than that the their them then there they this to too up us was we were what when which who why will with would you your about after again all also am any because before being both could did down each few further had having here hers herself himself itself let more most much myself no nor not now off once only other ought ours ourselves out over own same should some such theirs themselves these those through under until very while whom yours yourself yourselves keep keeps always never every still really want'.split(' '));
const processTerm = (t) => { const w = t.toLowerCase(); return w.length < 3 || STOP.has(w) ? null : w; };

let corpusPromise;
export function loadCorpus() {
  corpusPromise ||= fetch(`${B}/corpus.json`).then((r) => { if (!r.ok) throw new Error('Could not load the manual data.'); return r.json(); }).then(build);
  return corpusPromise;
}

function build(corpus) {
  const ideaById = new Map(corpus.ideas.map((i) => [i.id, i]));
  const tacticBySlug = new Map(corpus.tactics.map((t) => [t.slug, t]));
  const ideas = new MiniSearch({ fields: ['name', 'text', 'try'], storeFields: ['id'], idField: 'id', processTerm });
  ideas.addAll(corpus.ideas);
  const tactics = new MiniSearch({
    fields: ['title', 'situation', 'tags', 'principle', 'scene', 'moves'],
    storeFields: ['slug'],
    idField: 'slug',
    processTerm,
    extractField: (doc, f) => (Array.isArray(doc[f]) ? doc[f].join(' ') : doc[f]),
  });
  tactics.addAll(corpus.tactics);
  const anchors = corpus.chapters.map((c) => c.key);
  return { corpus, ideaById, tacticBySlug, ideas, tactics, anchors };
}

const byId = (a, b) => { const [ac, av] = a.id.split('.').map(Number); const [bc, bv] = b.id.split('.').map(Number); return ac - bc || av - bv; };

export function retrieve(db, text, { ideas = 8, tactics = 3 } = {}) {
  const opts = { fuzzy: 0.2, prefix: true, combineWith: 'OR' };
  const tHits = db.tactics.search(text, { ...opts, boost: { situation: 3, title: 2, tags: 2 } }).slice(0, tactics).map((h) => db.tacticBySlug.get(h.id));
  const iHits = db.ideas.search(text, { ...opts, boost: { name: 2 } }).slice(0, ideas).map((h) => h.id);
  const ids = new Set([...tHits.flatMap((t) => t.ideas), ...iHits]);
  // one anchor idea per chapter keeps the model's menu broad even when keywords miss
  for (const a of db.anchors) ids.add(a);
  const ideaList = [...ids].map((id) => db.ideaById.get(id)).filter(Boolean).sort(byId);
  return { tactics: tHits, ideas: ideaList, topIdeas: iHits.map((id) => db.ideaById.get(id)) };
}
