const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database');
    
    // Create tables if they don't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS csv_import (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        initials TEXT NOT NULL,
        age INTEGER NOT NULL,
        dateOfBirth TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Table "csv_import" ready');
      }
    });
  }
});

module.exports = db;