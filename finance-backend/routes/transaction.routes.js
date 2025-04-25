const router = require('express').Router();
const controller = require('../controllers/transaction.controller');
const auth = require('../middleware/auth.middleware');
const Transaction = require('../models/transaction.model');

// Use the auth middleware to verify the token for all routes in this router
router.use(auth.verifyToken);

// Get all transactions
router.get('/', controller.getAll);

// Add a new transaction
router.post('/', controller.add);

// Delete a transaction by ID
router.delete('/:id', controller.delete);

// Update a transaction by ID
router.put('/:id', async (req, res) => {
  try {
    const { type, amount, description, date, account, category } = req.body;
    const transactionId = req.params.id;

    // Find the transaction by ID and update it
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        type,
        amount,
        description,
        date,
        account,
        category
      },
      { new: true } // Returns the updated document
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: 'Error updating transaction', error: error.message });
  }
});

module.exports = router;
