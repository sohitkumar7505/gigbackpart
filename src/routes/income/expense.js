import express from 'express';
import Expense from '../../models/income/expense.js';

const router = express.Router();

// POST endpoint
// router.post('/', async (req, res) => {
//   try {
//     const { amount, type } = req.body;  // Changed from expense to amount
//     const data = new Expense({ amount, type });
//     await data.save();
    
//     res.status(201).json({ message: 'Expense saved!', data });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.post('/', async (req, res) => {
  try {
    const { amount, type } = req.body;  // Changed from earning to amount to match schema
    const data = new Expense({ amount, type });  // Create new Earning with the data
    await data.save();
    res.status(201).json({ message: 'Earning saved!', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const query = {};

    if (date) {
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0); // Start of the day (00:00:00)
      const end = new Date(start);
      end.setDate(end.getDate() + 1); // Start of the next day (exclusive)

      query.date = {
        $gte: start,
        $lt: end
      };
    }

    const expense = await Expense.find(query);
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



export default router;