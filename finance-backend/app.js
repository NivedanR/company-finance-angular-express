const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable');// This adds autoTable as a plugin to jsPDF
const Transaction = require('./models/transaction.model'); // Make sure this path is correct

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:4200', // Angular frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transaction.routes');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// POST /api/send-report - Generates a transaction report PDF and emails it
app.post('/api/send-report', async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const transactions = await Transaction.find({
      date: { $gte: oneWeekAgo }
    });

    const doc = new jsPDF();
    doc.text('Transaction Summary', 10, 10);

    doc.autoTable({
      head: [['Type', 'Amount', 'Category', 'Date']],
      body: transactions.map(t => [
        t.type,
        t.amount.toFixed(2),
        t.category,
        new Date(t.date).toLocaleDateString()
      ])
    });

    const pdfBase64 = doc.output('datauristring');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nivedanreddy2001@gmail.com',
        pass: 'puvq qrez vusq mrzt' // Use App Password, not your Gmail password
      }
    });

    const mailOptions = {
      from: 'nivedanreddy2001@gmail.com',
      to: 'nivedanr22@gmail.com',
      subject: 'Weekly Transaction Summary Report',
      text: 'Attached is the transaction summary report for the past week.',
      attachments: [
        {
          filename: 'transaction-summary.pdf',
          content: pdfBase64.split('base64,')[1],
          encoding: 'base64'
        }
      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = app;
