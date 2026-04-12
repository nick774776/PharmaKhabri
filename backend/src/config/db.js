const mongoose = require('mongoose');
const env = require('./env');
 
let isConnected = false;
 
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(env.MONGO_URI, {
      dbName: 'pharmanews',
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅  MongoDB connected');
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  }
}
 
module.exports = connectDB;