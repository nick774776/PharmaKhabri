const express     = require('express');
const path        = require('path');
const helmet      = require('helmet');
const cors        = require('cors');
const rateLimit   = require('express-rate-limit');
const connectDB   = require('./config/db');
const env         = require('./config/env');
const newsRoutes  = require('./routes/news');
const subRoutes   = require('./routes/subscribe');
const { scheduleIngestion } = require('./queues/ingestionQueue');
 
const app = express();
 
// serve static frontend from public map to root
app.use(express.static(path.join(__dirname, '../../public')));

app.use(helmet({ contentSecurityPolicy: false })); // disable CSP for easier styling/scripting on static frontend
app.use(cors({ origin: '*', methods: ['GET','POST'] }));
app.use(express.json({ limit: "10kb" }));
 
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
const subscribeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many subscription attempts, please wait.' },
});
 
app.use('/news',      apiLimiter,       newsRoutes);
app.use('/subscribe', subscribeLimiter, subRoutes);
app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date() }));
 
(async () => {
  await connectDB();
  await scheduleIngestion();
  app.listen(env.PORT, () =>
    console.log(`🚀  API running on port ${env.PORT}`)  
  );
})();
 
module.exports = app;