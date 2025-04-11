import express from 'express';
import axios from 'axios';
import Report from '../../models/income/report.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { date, target = 0 } = req.body;

  try {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

    // Ensure UTC date range for daily query
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    // Call earnings and expenses APIs using the start date (will be handled on their side)
    const queryDate = start.toISOString().split('T')[0];

    const [earningsRes, expensesRes] = await Promise.all([
      axios.get(`${baseUrl}/earning?date=${queryDate}`),
      axios.get(`${baseUrl}/expense?date=${queryDate}`)
    ]);

    const earnings = earningsRes.data || [];
    const expenses = expensesRes.data || [];

    // Validate API responses
    if (!Array.isArray(earnings) || !Array.isArray(expenses)) {
      throw new Error('Invalid data structure received from APIs');
    }

    // Aggregate earnings by platform
    const earningsByPlatform = earnings.reduce((acc, { amount, platform }) => {
      if (!platform) return acc;
      acc[platform] = (acc[platform] || 0) + (amount || 0);
      return acc;
    }, {});

    const totalEarnings = Object.values(earningsByPlatform)
      .reduce((sum, val) => sum + val, 0);

    // Aggregate expenses by type
    const expensesByType = expenses.reduce((acc, { amount, type }) => {
      if (!type) return acc;
      acc[type] = (acc[type] || 0) + (amount || 0);
      return acc;
    }, {});

    const totalExpenses = Object.values(expensesByType)
      .reduce((sum, val) => sum + val, 0);

    const balance = totalEarnings - totalExpenses;

    // Format for database storage
    const formattedEarnings = Object.entries(earningsByPlatform)
      .map(([platform, amount]) => ({ platform, amount }));

    const formattedExpenses = Object.entries(expensesByType)
      .map(([type, amount]) => ({ type, amount }));

    const newReport = new Report({
      date: start,
      target,
      totalEarnings,
      totalExpenses,
      balance,
      earnings: formattedEarnings,
      expenses: formattedExpenses
    });

    await newReport.save();

    res.status(201).json({
      message: 'Report generated and saved successfully',
      report: newReport
    });

  } catch (err) {
    console.error('Error generating report:', err);
    res.status(500).json({
      error: 'Failed to generate report',
      details: err.message
    });
  }
});



router.get('/', async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }

    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const report = await Report.findOne({
      date: {
        $gte: start,
        $lt: end
      }
    });

    if (!report) {
      return res.status(404).json({ message: 'No report found for the given date' });
    }

    res.status(200).json({
      message: 'Report retrieved successfully',
      report: {
        totalEarnings: report.totalEarnings,
        totalExpenses: report.totalExpenses,
        balance: report.balance,
        earnings: report.earnings,
        expenses: report.expenses,
        target: report.target,
        date: report.date
      }
    });

  } catch (err) {
    console.error('Error retrieving report:', err);
    res.status(500).json({
      error: 'Failed to retrieve report',
      details: err.message
    });
  }
});

export default router;
