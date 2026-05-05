import express from 'express';
import Room from '../models/Room.js';

const router = express.Router();

// In-memory fallback when DB is unavailable
let fallbackRooms = [];

/**
 * CREATE ROOM
 */
router.post('/', async (req, res) => {
  try {
    const { userId, userName } = req.body;

    const roomId = Math.random().toString(36).substring(2, 8);

    // Try DB first, fallback to memory
    try {
      const room = new Room({
        roomId,
        userId,
        userName
      });
      await room.save();
    } catch (dbErr) {
      // Fallback to in-memory
      fallbackRooms.push({
        roomId,
        userId,
        userName,
        createdAt: new Date()
      });
    }

    res.status(201).json({
      roomId,
      message: 'Room created successfully'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET ALL ROOMS OF A USER
 */
router.get('/:userId', async (req, res) => {
  try {
    let rooms;
    try {
      rooms = await Room.find({ userId: req.params.userId })
        .sort({ createdAt: -1 });
    } catch (dbErr) {
      // Fallback to in-memory
      rooms = fallbackRooms.filter(r => r.userId === req.params.userId);
    }

    res.json(rooms || []);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE ROOM
 */
router.delete('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;

    try {
      await Room.deleteOne({ roomId });
    } catch (dbErr) {
      // Fallback to in-memory
      fallbackRooms = fallbackRooms.filter(r => r.roomId !== roomId);
    }

    res.json({ message: 'Room deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;