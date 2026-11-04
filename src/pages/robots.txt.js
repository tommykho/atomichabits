// robots.txt generated at build time so the sitemap URL follows SITE_URL + BASE_PATH on any host.
export function GET({ site }) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/+$/, '');
  const sitemap = new URL(`${base}/sitemap-index.xml`, site).href;
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
