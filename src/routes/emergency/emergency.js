import express from 'express';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

router.post('/', async (req, res) => {
  const { number, latitude, longitude, message } = req.body;

  if (!number || !latitude || !longitude) {
    return res.status(400).json({ error: 'Mobile number, latitude, and longitude are required' });
  }

  const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const bodyMessage = message
    ? `🚨 Message: ${message}\n📍 Location: ${mapsLink}`
    : `🚨 Emergency! Location: ${mapsLink}`;

  try {
    const sms = await client.messages.create({
      body: bodyMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: number,
    });

    console.log('SMS sent. SID:', sms.sid);
    res.status(200).json({ message: 'SMS sent successfully!', sid: sms.sid });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});
// Add this to your backend router
router.get('/safety-status', async (req, res) => {
    try {
      // In a real app, you would fetch this from a database
      const safetyStatus = {
        locationSharing: true,
        trustedContacts: 3
      };
      res.status(200).json(safetyStatus);
    } catch (error) {
      console.error('Error fetching safety status:', error);
      res.status(500).json({ error: 'Failed to fetch safety status' });
    }
  });
export default router;
