import { Router } from 'express';
const router = Router();
import db from './database.mjs';

// Register a new device with optional location and status
router.post('/devices', (req, res) => {
  const { deviceId, status, latitude, longitude } = req.body;

  // Validate the presence of deviceId
  if (!deviceId) {
    return res.status(400).json({ error: 'deviceId is required' });
  }

  // Validate that status is 0 or 1
  const validStatus = status === 0 || status === 1;
  if (status !== undefined && !validStatus) {
    return res.status(400).json({ error: 'Status must be 0 or 1' });
  }

  // Set default values for optional fields
  const deviceStatus = validStatus ? status : 1; // Default status is 1 if not provided or invalid
  const deviceLatitude = latitude !== undefined ? latitude : null; // Default is null if not provided
  const deviceLongitude = longitude !== undefined ? longitude : null; // Default is null if not provided

  // Insert or update the device in the database (INSERT OR REPLACE)
  db.run(
    'INSERT OR REPLACE INTO devices (deviceId, status, latitude, longitude) VALUES (?, ?, ?, ?)',
    [deviceId, deviceStatus, deviceLatitude, deviceLongitude],
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

// Update device status and/or location (latitude, longitude)
router.put('/devices/:deviceId', (req, res) => {
  const { deviceId } = req.params;
  const { status, latitude, longitude } = req.body;

  // Validate status to be 0 or 1
  if (status !== undefined && status !== 0 && status !== 1) {
    return res.status(400).json({ error: 'Status must be 0 or 1' });
  }

  if (status === undefined && latitude === undefined && longitude === undefined) {
    return res.status(400).json({ error: 'At least one field (status, latitude, longitude) is required' });
  }

  let updateQuery = 'UPDATE devices SET ';
  const params = [];

  if (status !== undefined) {
    updateQuery += 'status = ?, ';
    params.push(status);
  }

  if (latitude !== undefined) {
    updateQuery += 'latitude = ?, ';
    params.push(latitude);
  }

  if (longitude !== undefined) {
    updateQuery += 'longitude = ?, ';
    params.push(longitude);
  }

  // Remove the last comma and space
  updateQuery = updateQuery.slice(0, -2);
  updateQuery += ' WHERE deviceId = ?';
  params.push(deviceId);

  db.run(updateQuery, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes > 0) {
      res.json({ message: 'Device updated successfully' });
    } else {
      res.status(404).json({ error: 'Device not found' });
    }
  });
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
});

export default router;

