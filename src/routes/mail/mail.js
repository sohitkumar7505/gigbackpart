import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vkvermaa134@gmail.com', // Replace with your email
    pass: process.env.PASSWORD,     // Replace with your app password
  },
});

// Test email configuration
transporter.verify((error) => {
  if (error) {
    console.log('Error with email config:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, address, category, description } = req.body;

    // Validation
    if (!name || !address || !category || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const mailOptions = {
      from: '"Concern Form" <vkvermaa134@gmail.com>',
      to: 'sohitkumar3139@gmail.com', // Your receiving email
      subject: `New Concern: ${category}`,
      text: `
        Name: ${name}
        Address: ${address}
        Category: ${category}
        Description: ${description}
      `,
      html: `
        <h2>New Concern Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Description:</strong></p>
        <p>${description.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Concern submitted successfully' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to submit concern' });
  }
});


export default router;