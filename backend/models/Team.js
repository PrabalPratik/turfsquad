const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sport: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: Date,
    required: true
  },
  totalSlots: {
    type: Number,
    required: true,
    min: 2
  },
  filledSlots: {
    type: Number,
    default: 0
  },
  pricePerSlot: {
    type: Number,
    required: true,
    min: 0
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  players: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending'
    }
  }],
  status: {
    type: String,
    enum: ['open', 'full', 'cancelled'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for available slots
teamSchema.virtual('availableSlots').get(function() {
  return this.totalSlots - this.filledSlots;
});

// Middleware to update status when slots are filled
teamSchema.pre('save', function(next) {
  if (this.filledSlots >= this.totalSlots) {
    this.status = 'full';
  } else if (this.status !== 'cancelled') {
    this.status = 'open';
  }
  next();
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team; 