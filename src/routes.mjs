import { Router } from 'express';
const router = Router();
import db from './database.mjs';

// Register a new device
router.post('/register', (req, res) => {
  const { deviceId } = req.body;
  if (!deviceId) {
    return res.status(400).json({ error: 'deviceId is required' });
  }

  db.run(
    'INSERT INTO devices (deviceId, status) VALUES (?, 1)',
    [deviceId],
    (err) => {
      if (err) {
        return res.status(400).json({ error: 'Device already exists or invalid' });
      }
      res.status(201).json({ message: 'Device registered successfully' });
    }
  );
});

// Get all devices or a specific device by deviceId
router.get('/devices', (req, res) => {
  const { deviceId } = req.query;

  if (deviceId) {
    db.get('SELECT * FROM devices WHERE deviceId = ?', [deviceId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (row) {
        res.json(row);
      } else {
        res.status(404).json({ error: 'Device not found' });
      }
    });
  } else {
    db.all('SELECT * FROM devices', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  }
});

// Update device status
router.patch('/devices/:deviceId', (req, res) => {
  const { deviceId } = req.params;
  const { status } = req.body;

  if (status === undefined) {
    return res.status(400).json({ error: 'Status is required' });
  }

  db.run(
    'UPDATE devices SET status = ? WHERE deviceId = ?',
    [status, deviceId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes > 0) {
        res.json({ message: 'Status updated successfully' });
      } else {
        res.status(404).json({ error: 'Device not found' });
      }
    }
  );
});

// Delete device
router.delete('/devices/:deviceId', (req, res) => {
  const { deviceId } = req.params;

  db.run(
    'DELETE FROM devices WHERE deviceId = ?',
    [deviceId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes > 0) {
        res.json({ message: 'Device deleted successfully' });
      } else {
        res.status(404).json({ error: 'Device not found' });
      }
    }
  );
})

export default router;

