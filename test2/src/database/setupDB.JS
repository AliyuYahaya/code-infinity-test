// ================================ [IMPORTS] ================================ //
// SQLite for our database needs
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { DB_TABLE } = require('../utils/constants');

// ================================ [DATABASE CONNECTION] ================================ //
// Setting up our connection to the SQLite database
// I'm using verbose() so we get more detailed error messages
const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    
    // Make sure our table exists
    createTableIfNeeded();
  }
});

// ================================ [TABLE CREATION] ================================ //
// Creates our CSV_IMPORT table if it doesn't already exist
// This way we don't have to manually set up the database
function createTableIfNeeded() {
  const query = `
    CREATE TABLE IF NOT EXISTS ${DB_TABLE} (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      surname TEXT NOT NULL,
      initials TEXT NOT NULL,
      age INTEGER NOT NULL,
      dateOfBirth TEXT NOT NULL
    )
  `;
  
  db.run(query, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log(`Table "${DB_TABLE}" is ready for data`);
    }
  });
}
// ================================ [EoM] ================================ //

// ================================ [MODULE EXPORTS] ================================ //
module.exports = db;
// ================================ [EoF] ================================ //