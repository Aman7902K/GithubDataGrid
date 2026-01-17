import mongoose from 'mongoose';
import { DB_NAME } from '../constants/index.js';
import dotenv from 'dotenv';

dotenv.config();

// Remove trailing slash from MONGO_URI if present
const baseUri = process.env.MONGO_URI.replace(/\/$/, '');
const mongoUrl = `${baseUri}/${DB_NAME}`;

const conn = mongoose.connect(mongoUrl)
.then(() => console.log('MongoDB connected successfully to:', mongoUrl))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Attempted connection URL:', mongoUrl);
});

export default conn;