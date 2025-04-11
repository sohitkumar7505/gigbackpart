import express from 'express';
import Earning from '../../models/income/earnings.js';

const router = express.Router();

// router.post('/', async (req, res) => {
//   try {
//     const {earning ,platform}= new Earning(req.body);
//     const data={earning,platform}
//     await data.save();
//     res.status(201).json({ message: 'Earning saved!' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.post('/', async (req, res) => {
  try {
    const { amount, platform } = req.body;  // Changed from earning to amount to match schema
    const data = new Earning({ amount, platform });  // Create new Earning with the data
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
      start.setUTCHours(0, 0, 0, 0); // Set to start of day (00:00 UTC)
      
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1); // Next day

      query.date = {
        $gte: start,
        $lt: end
      };
    }

    const expense = await Earning.find(query);
    res.status(200).json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
