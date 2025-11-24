import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema({
  data: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Memory = mongoose.model('Memory', memorySchema);
