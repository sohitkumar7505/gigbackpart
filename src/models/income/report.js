import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  target: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    required: true
  },
  totalExpenses: {
    type: Number,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  earnings: [{
    platform: { type: String, required: true },
    amount: { type: Number, required: true }
  }],
  expenses: [{
    type: { type: String, required: true },
    amount: { type: Number, required: true }
  }]
});

export default mongoose.model('Report', reportSchema);
