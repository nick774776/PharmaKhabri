const Parser = require('rss-parser');
const md5    = require('md5');
 
const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; PharmaKhabri/1.0)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
});
 
const RSS_FEEDS = [
  { url: 'https://www.fiercepharma.com/rss/xml',          source: 'FiercePharma'   },
  { url: 'https://www.pharmatimes.com/rss.aspx',          source: 'PharmaTimes'    },
  { url: 'https://www.biopharmadive.com/feeds/news/',     source: 'BioPharma Dive' },
  { url: 'https://www.who.int/rss-feeds/news-english.xml',source: 'WHO'            },
  { url: 'https://pubmed.ncbi.nlm.nih.gov/rss/search/pharma/?limit=20', source: 'PubMed' },
  { url: 'https://www.nature.com/subjects/pharmacology.rss', source: 'Nature Pharmacology' },
];
 
function categorize(text = "", source = "") {
  const t = text.toLowerCase();
  const cats = [];
  if (/\bfda\b|approval|cleared|authorized/.test(t))         cats.push('fda');
  if (/clinical trial|phase [123]|\bict\b|study/.test(t))    cats.push('clinical-trials');
  if (/biotech|biologic|mab\b|gene therapy/.test(t))          cats.push('biotech');
  if (/regulation|policy|guideline|compliance/.test(t))        cats.push('regulations');
  if (/pharmacology/.test(t) || source === 'Nature Pharmacology') cats.push('pharmacology');
  return cats.length ? cats : ['general'];
}
 
async function fetchRSSFeeds() {
  const results = [];
  for (const feed of RSS_FEEDS) {
    try {
      const data = await parser.parseURL(feed.url);
      for (const item of data.items) {
        let itemTitle = "";
        if (typeof item.title === 'string') {
          itemTitle = item.title;
        } else if (item.title && typeof item.title === 'object') {
          itemTitle = item.title._ || "";
        } else if (item.title != null) {
          try { itemTitle = String(item.title); } catch (e) { itemTitle = ""; }
        }
        if (!itemTitle || !item.link) continue;
        const norm = {
          title:       itemTitle.trim(),
          description: item.contentSnippet || item.summary || "",
          url:         item.link,
          contentHash: md5(`${itemTitle.trim()}${feed.source}`),
          source:      feed.source,
          category:    categorize(`${itemTitle} ${item.contentSnippet || ""}`, feed.source),
          image:       item.enclosure?.url || item["media:content"]?.$.url || null,
          publishedAt: new Date(item.pubDate || item.isoDate || Date.now()),
        };
        results.push(norm);
      }
    } catch (err) {
      console.warn(`RSS fetch failed [${feed.source}]: ${err.message}`);
    }
  }
  return results;
}
 
module.exports = { fetchRSSFeeds };