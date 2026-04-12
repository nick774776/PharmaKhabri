const { Schema, model } = require('mongoose');
const crypto = require('crypto');
 
const userSchema = new Schema({
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  preferences: {
    categories: { type: [String], default: ['fda', 'biotech', 'clinical-trials'] },
    frequency:  { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  },
  isVerified:       { type: Boolean, default: false },
  verifyToken:      { type: String, default: () => crypto.randomBytes(32).toString("hex") },
  unsubscribeToken: { type: String, default: () => crypto.randomBytes(32).toString("hex") },
}, { timestamps: true });
 
module.exports = model('User', userSchema);