const express = require('express');
const Team = require('../models/Team');
const User = require('../models/User');
const router = express.Router();

// Auth middleware (imported from auth.js)
const auth = require('../middleware/auth');

// Create a team
router.post('/', auth, async (req, res) => {
  try {
    const { name, sport, location, time, totalSlots, pricePerSlot } = req.body;
    
    const team = new Team({
      name,
      sport,
      location,
      time: new Date(time),
      totalSlots,
      pricePerSlot,
      creator: req.user._id,
      players: [{ user: req.user._id, paymentStatus: 'completed' }]
    });

    team.filledSlots = 1; // Creator fills one slot
    await team.save();

    // Add team to creator's teams
    await User.findByIdAndUpdate(req.user._id, {
      $push: { teams: team._id }
    });

    res.status(201).json({ message: 'Team created successfully', team });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all teams with filters
router.get('/', async (req, res) => {
  try {
    const { sport, location, date } = req.query;
    const query = {};

    if (sport) query.sport = sport;
    if (location) query.location = location;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.time = { $gte: startDate, $lt: endDate };
    }

    query.status = 'open'; // Only show open teams

    const teams = await Team.find(query)
      .populate('creator', 'name email')
      .populate('players.user', 'name email');

    res.json(teams);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('players.user', 'name email');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Join a team
router.post('/:id/join', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.status !== 'open') {
      return res.status(400).json({ message: 'Team is not open for joining' });
    }

    // Check if user is already in the team
    const isAlreadyJoined = team.players.some(player => 
      player.user.toString() === req.user._id.toString()
    );

    if (isAlreadyJoined) {
      return res.status(400).json({ message: 'Already joined this team' });
    }

    team.players.push({ user: req.user._id });
    team.filledSlots += 1;
    await team.save();

    // Add team to user's teams
    await User.findByIdAndUpdate(req.user._id, {
      $push: { teams: team._id }
    });

    res.json({ message: 'Successfully joined team', team });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Leave a team
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if user is in the team
    const playerIndex = team.players.findIndex(player => 
      player.user.toString() === req.user._id.toString()
    );

    if (playerIndex === -1) {
      return res.status(400).json({ message: 'Not a member of this team' });
    }

    // Cannot leave if you're the creator
    if (team.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Creator cannot leave the team' });
    }

    team.players.splice(playerIndex, 1);
    team.filledSlots -= 1;
    await team.save();

    // Remove team from user's teams
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { teams: team._id }
    });

    res.json({ message: 'Successfully left team', team });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 