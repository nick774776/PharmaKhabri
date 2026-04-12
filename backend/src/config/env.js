const { z } = require('zod');
require('dotenv').config();

const schema = z.object({
  PORT:            z.string().default('4000'),
  NODE_ENV:        z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI:       z.string().min(1),
  REDIS_URL:       z.string().url(),
  NEWSAPI_KEY:     z.string().min(1),
  GNEWS_KEY:       z.string().min(1),
  CORS_ORIGIN:     z.string().url(),
  UNSUBSCRIBE_SECRET: z.string().min(16),
});
 
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌  Missing/invalid environment variables:');
  console.error(parsed.error.format());
  process.exit(1);
}
 
module.exports = parsed.data;