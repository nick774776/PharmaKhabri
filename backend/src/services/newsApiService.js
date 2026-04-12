const axios = require('axios');
const md5   = require('md5');
 
const KEYWORDS = "pharma OR biotech OR FDA OR \"drug trial\" OR medicine";
 
async function fetchNewsAPI(apiKey) {
  const url = "https://newsapi.org/v2/everything";
  const { data } = await axios.get(url, {
    params: {
      q: KEYWORDS,
      language: "en",
      sortBy: "publishedAt",
      pageSize: 50,
      apiKey,
    },
    timeout: 10000,
  });
  return (data.articles || []).map(a => ({
    title:       a.title?.trim() || '',
    description: a.description || a.content || "",
    url:         a.url,
    contentHash: md5(`${a.title?.trim()}NewsAPI`),
    source:      a.source?.name || 'NewsAPI',
    category:    categorize(`${a.title} ${a.description}`),
    image:       a.urlToImage || null,
    publishedAt: new Date(a.publishedAt || Date.now()),
  }));
}
 
async function fetchGNews(apiKey) {
  const url = "https://gnews.io/api/v4/search";
  const { data } = await axios.get(url, {
    params: {
      q: "pharma biotech FDA",
      lang: "en",
      max: 50,
      token: apiKey,
    },
    timeout: 10000,
  });
  return (data.articles || []).map(a => ({
    title:       a.title?.trim() || '',
    description: a.description || "",
    url:         a.url,
    contentHash: md5(`${a.title?.trim()}GNews`),
    source:      a.source?.name || 'GNews',
    category:    categorize(`${a.title} ${a.description}`),
    image:       a.image || null,
    publishedAt: new Date(a.publishedAt || Date.now()),
  }));
}
 
function categorize(text = '') {
  const t = text.toLowerCase();
  const cats = [];
  if (/\bfda\b|approval|cleared/.test(t))             cats.push('fda');
  if (/clinical trial|phase [123]|study/.test(t))      cats.push('clinical-trials');
  if (/biotech|biologic|gene therapy/.test(t))         cats.push('biotech');
  if (/regulation|policy|guideline/.test(t))           cats.push('regulations');
  return cats.length ? cats : ['general'];
}
 
module.exports = { fetchNewsAPI, fetchGNews };