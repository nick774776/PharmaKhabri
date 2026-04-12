const News = require('../models/News');
const { fetchRSSFeeds }              = require('./rssService');
const { fetchNewsAPI, fetchGNews }   = require('./newsApiService');
const env                            = require('../config/env');
 
async function runIngestion() {
  console.log("🔄  Starting ingestion run...");
 
  const [rssItems, newsApiItems, gNewsItems] = await Promise.allSettled([
    fetchRSSFeeds(),
    fetchNewsAPI(env.NEWSAPI_KEY),
    fetchGNews(env.GNEWS_KEY),
  ]);
 
  const all = [
    ...(rssItems.status === "fulfilled"     ? rssItems.value     : []),
    ...(newsApiItems.status === "fulfilled" ? newsApiItems.value : []),
    ...(gNewsItems.status === "fulfilled"   ? gNewsItems.value   : []),
  ];
 
  console.log(`📰  Total raw articles fetched: ${all.length}`);
 
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const fresh  = all.filter(a => a.publishedAt > cutoff && a.title && a.url);
 
  let saved = 0, skipped = 0;
  for (const item of fresh) {
    try {
      await News.updateOne(
        { $or: [{ url: item.url }, { contentHash: item.contentHash }] },
        { $setOnInsert: item },
        { upsert: true },
      );
      saved++;
    } catch (err) {
      if (err.code === 11000) { skipped++; }
      else { console.error('Upsert error:', err.message); }
    }
  }
  console.log(`✅  Ingestion complete — saved: ${saved}, skipped: ${skipped}`);
  return { saved, skipped };
}
 
module.exports = { runIngestion };