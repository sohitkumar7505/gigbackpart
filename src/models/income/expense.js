import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  amount: Number,
  type: String,
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', ExpenseSchema);

export default Expense;
