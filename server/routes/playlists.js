const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');

// GET all playlists
router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find().sort({ createdAt: -1 });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new playlist
router.post('/', async (req, res) => {
  try {
    const { id, name, songs } = req.body;
    const playlist = new Playlist({ id, name, songs: songs || [] });
    const newPlaylist = await playlist.save();
    res.status(201).json(newPlaylist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) a playlist by id
router.put('/:id', async (req, res) => {
  try {
    const { name, songs } = req.body;
    const updatedPlaylist = await Playlist.findOneAndUpdate(
      { id: req.params.id },
      { name, songs },
      { new: true }
    );
    if (!updatedPlaylist) return res.status(404).json({ message: 'Playlist not found' });
    res.json(updatedPlaylist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a playlist by id
router.delete('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({ id: req.params.id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    res.json({ message: 'Playlist deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
