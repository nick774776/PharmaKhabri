const { Queue, Worker } = require('bullmq');
const IORedis          = require('ioredis');
const { runIngestion } = require('../services/ingestService');
const env              = require('../config/env');
 
const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });
 
const ingestionQueue = new Queue('pharma-ingestion', { connection });
 
new Worker('pharma-ingestion', async job => {
  await runIngestion();
}, { connection, concurrency: 1 });
 
async function scheduleIngestion() {
  await ingestionQueue.add(
    "recurring-ingest",
    {},
    {
      jobId: "recurring-ingest",
      repeat: { every: 2 * 60 * 60 * 1000 },
      removeOnComplete: 10,
      removeOnFail: 5,
    },
  );
  console.log("⏰  Ingestion scheduled every 2 hours");
}
 
module.exports = { ingestionQueue, scheduleIngestion };