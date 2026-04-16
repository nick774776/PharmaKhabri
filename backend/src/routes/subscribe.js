const express = require('express');
const { z }   = require('zod');
const User    = require('../models/User');
const router  = express.Router();

// 🔒 Middleware
const internalOnly = (req, res, next) => {
  if (req.headers['x-internal-key'] !== process.env.INTERNAL_API_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// ✅ Protected route
router.get('/active', internalOnly, async (req, res) => {
  try {
    const subs = await User.find({
      isVerified: true
    }).select('email unsubscribeToken preferences');

    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
const subscribeSchema = z.object({
  email:      z.string().email(),
  categories: z.array(z.string()).optional().default(['fda','biotech','clinical-trials']),
  frequency:  z.enum(['daily','weekly']).optional().default('daily'),
});
 
router.post('/', async (req, res) => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
 
  const { email, categories, frequency } = parsed.data;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { preferences: { categories, frequency }, isVerified: false },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    res.json({ message: "Check your email to confirm your subscription." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
router.get('/verify/:token', async (req, res) => {
  const user = await User.findOneAndUpdate(
    { verifyToken: req.params.token },
    { isVerified: true },
    { new: true },
  );
  if (!user) return res.status(400).send("Invalid or expired token.");
  res.send("✅ Subscription confirmed! You will receive your first digest tomorrow.");
});
 
router.get('/unsubscribe/:token', async (req, res) => {
  await User.deleteOne({ unsubscribeToken: req.params.token });
  res.send("You have been unsubscribed.");
});
 
module.exports = router;