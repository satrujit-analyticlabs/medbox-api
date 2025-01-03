import sqlite3 from 'sqlite3'; // Use ES module import
sqlite3.verbose();  // Enable verbose mode

// Create database connection
const db = new sqlite3.Database('./devices.db');

// Create table for devices
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS devices (
      deviceId TEXT PRIMARY KEY,
      status INTEGER DEFAULT 1
    )
  `);
});

export default db;

