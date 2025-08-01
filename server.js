// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { name, email, subject, message, service, phone } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    let emailText = '';

    if (name) emailText += `სახელი: ${name}\n`;
    if (email) emailText += `ელფოსტა: ${email}\n`;
    if (phone) emailText += `ტელეფონი: ${phone}\n`;
    if (subject) emailText += `თემა: ${subject}\n`;
    if (service) emailText += `სერვისი: ${service}\n`;
    if (message) emailText += `შეტყობინება:\n${message}\n`;

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: subject || 'ახალი შეტყობინება ფორმიდან',
      text: emailText,
    });

    res.status(200).send({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ success: false, message: 'Failed to send email' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
