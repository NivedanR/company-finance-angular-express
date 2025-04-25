const Transaction = require('../models/transaction.model');

exports.getAll = async (req, res) => {
  const transactions = await Transaction.find({ createdBy: req.user.userId });
  res.json(transactions);
};

exports.add = async (req, res) => {
  const transaction = new Transaction({ ...req.body, createdBy: req.user.userId });
  await transaction.save();
  res.json(transaction);
};

exports.delete = async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
