import express from "express";
import cors from "cors";
import connectToMongoDB from "./src/models/mongodb.js";
import dotenv from 'dotenv';

dotenv.config();
import earningRoutes from './src/routes/income/earning.js';
import expenseRoutes from './src/routes/income/expense.js';
import reportRoutes from './src/routes/income/report.js';
import emergencyRoutes from './src/routes/emergency/emergency.js'
import mailRoutes from './src/routes/mail/mail.js'
const app = express(); // ✅ Must come before any use of `app`

// Connect to MongoDB
connectToMongoDB();

// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use('/earning', earningRoutes);
app.use('/expense', expenseRoutes);
app.use('/report', reportRoutes);
app.use('/emergency', emergencyRoutes);
app.use('/submit-mail', mailRoutes);
// Start server
const port=process.env.PORT||3000;
app.listen(port,() => {
  console.log("Server is running on http://localhost:3000");
});
