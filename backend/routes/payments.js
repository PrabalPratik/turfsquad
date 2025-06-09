const express = require('express');
const Payment = require('../models/Payment');
const Team = require('../models/Team');
const User = require('../models/User');
const router = express.Router();

// Auth middleware
const auth = require('../middleware/auth');

// Create dummy order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { teamId } = req.body;
    
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const amount = team.pricePerSlot;
    const dummyOrderId = `dummy_order_${Date.now()}`;

    // Create payment record
    const payment = new Payment({
      user: req.user._id,
      team: team._id,
      amount: amount,
      razorpayOrderId: dummyOrderId,
      status: 'pending'
    });
    await payment.save();

    res.json({
      orderId: dummyOrderId,
      amount: amount,
      currency: 'INR'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

// Process dummy payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { orderId, teamId } = req.body;

    // Update payment record
    const payment = await Payment.findOne({ razorpayOrderId: orderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = 'completed';
    payment.razorpayPaymentId = `dummy_payment_${Date.now()}`;
    await payment.save();

    // Update team player's payment status
    await Team.findOneAndUpdate(
      { 
        _id: teamId,
        'players.user': req.user._id
      },
      {
        $set: { 'players.$.paymentStatus': 'completed' }
      }
    );

    // Update user's balance
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { balance: -payment.amount }
    });

    res.json({ message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Failed to process payment' });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('team')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 