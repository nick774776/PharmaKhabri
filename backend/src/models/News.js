const { Schema, model } = require('mongoose');
 
const newsSchema = new Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  url:         { type: String, required: true },          // raw URL
  contentHash: { type: String, required: true },          // MD5(title+source)
  source:      { type: String, required: true },
  category:    { type: [String], default: ['general'],
    enum: ['fda', 'clinical-trials', 'biotech', 'regulations', 'general'] },
  tags:        { type: [String], default: [] },
  image:       { type: String, default: null },
  publishedAt: { type: Date, required: true },
  aiSummary:   { type: String, default: null },
  viewCount:   { type: Number, default: 0 },
}, { timestamps: true });
 
newsSchema.index({ url: 1 },         { unique: true });
newsSchema.index({ contentHash: 1 }, { unique: true });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ category: 1 });
 
module.exports = model('News', newsSchema);