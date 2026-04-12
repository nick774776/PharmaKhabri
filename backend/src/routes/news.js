const express = require('express');
const News    = require('../models/News');
const router  = express.Router();
 
router.get('/', async (req, res) => {
  try {
    const {
      category,
      page  = 1,
      limit = 20,
      sort  = 'publishedAt',
    } = req.query;
 
    const filter = {};
    if (category) filter.category = { $in: [category] };
 
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await News.countDocuments(filter);
    const news  = await News
      .find(filter)
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');
 
    res.json({
      data: news,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
router.get('/:id', async (req, res) => {
  try {
    const article = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true },
    );
    if (!article) return res.status(404).json({ error: "Not found" });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
module.exports = router;