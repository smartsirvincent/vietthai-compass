const { htmlToDOM } = require('html-react-parser');
const origin = process.argv[2] || 'https://vietthai-compass.vercel.app';
function elements(nodes) {
  return nodes.flatMap(node => [node, ...elements(node.children || [])]);
}
async function main() {
  const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
  if (!sitemapResponse.ok) throw new Error(`Sitemap: ${sitemapResponse.status}`);
  const sitemap = elements(htmlToDOM(await sitemapResponse.text()));
  const urls = sitemap.filter(n => n.name === 'loc').map(n => n.children[0].data);
  const issues = [];
  const timings = [];
  for (const url of urls) {
    const start = performance.now();
    const response = await fetch(url);
    timings.push(performance.now() - start);
    const nodes = elements(htmlToDOM(await response.text()));
    const canonical = nodes.find(n => n.name === 'link' && n.attribs.rel === 'canonical')?.attribs.href;
    const headings = nodes.filter(n => n.name === 'h1');
    const description = nodes.find(n => n.name === 'meta' && n.attribs.name === 'description')?.attribs.content;
    const sameCanonical = canonical && new URL(canonical).href === new URL(url).href;
    if (response.status !== 200 || !sameCanonical || headings.length !== 1 || !description) {
      issues.push({ url, status: response.status, canonical, h1: headings.length, description: !!description });
    }
    for (const node of nodes.filter(n => n.name === 'script' && n.attribs.type === 'application/ld+json')) {
      try { JSON.parse(node.children.map(n => n.data || '').join('')); }
      catch { issues.push({ url, error: 'Invalid JSON-LD' }); }
    }
  }
  timings.sort((a,b) => a-b);
  console.log(JSON.stringify({ pages: urls.length, issues, medianTtfbMs: Math.round(timings[Math.floor(timings.length / 2)]) }, null, 2));
  if (issues.length) process.exitCode = 1;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
