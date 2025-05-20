// ================================ [IMPORTS] ================================ //
// Get our database connection and table name
const db = require('./setupDB');
const { DB_TABLE } = require('../utils/constants');

// ================================ [SAVE TO DATABASE] ================================ //
// Stores our generated data in the SQLite database
// Uses a more direct approach to ensure all records are inserted
const saveToDatabase = (data) => {
  return new Promise((resolve, reject) => {
    console.log(`Starting database transaction to save ${data.length} records...`);
    
    // Begin transaction
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        console.error('Failed to begin transaction:', err.message);
        return reject(err);
      }
      
      // First clear existing data
      db.run(`DELETE FROM ${DB_TABLE}`, (err) => {
        if (err) {
          console.error('Failed to clear existing data:', err.message);
          db.run('ROLLBACK');
          return reject(err);
        }
        
        console.log('Cleared existing records. Now inserting new data...');
        
        // Insert records one by one with explicit SQL
        let inserted = 0;
        let errors = 0;
        
        // Function to insert a record
        const insertRecord = (index) => {
          if (index >= data.length) {
            // We're done, commit the transaction
            console.log(`Inserted ${inserted} records (${errors} errors). Committing transaction...`);
            db.run('COMMIT', (err) => {
              if (err) {
                console.error('Failed to commit transaction:', err.message);
                db.run('ROLLBACK');
                return reject(err);
              }
              console.log(`Transaction committed successfully.`);
              resolve(inserted);
            });
            return;
          }
          
          const record = data[index];
          const sql = `INSERT INTO ${DB_TABLE} (id, name, surname, initials, age, dateOfBirth) VALUES (?, ?, ?, ?, ?, ?)`;
          
          db.run(sql, [
            record.id,
            record.name,
            record.surname,
            record.initials,
            record.age,
            record.dateOfBirth
          ], function(err) {
            if (err) {
              console.error(`Error inserting record ${record.id}:`, err.message);
              errors++;
            } else {
              inserted++;
            }
            
            // Log progress occasionally
            if (inserted > 0 && inserted % 50 === 0) {
              console.log(`Inserted ${inserted} of ${data.length} records...`);
            }
            
            // Process next record
            insertRecord(index + 1);
          });
        };
        
        // Start inserting records
        insertRecord(0);
      });
    });
  });
};
// ================================ [EoM] ================================ //

// ================================ [GET ALL RECORDS] ================================ //
// Retrieves all records from the database
// Used by the CSV export function to get the data
const getAllRecords = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${DB_TABLE} ORDER BY id`;
    
    db.all(query, (err, rows) => {
      if (err) {
        console.error('Failed to fetch records:', err.message);
        return reject(err);
      }
      
      console.log(`Retrieved ${rows.length} records from database`);
      resolve(rows);
    });
  });
};
// ================================ [EoM] ================================ //

// ================================ [CLEAR DATABASE] ================================ //
// Removes all records from the database
// Useful for testing or resetting the application
const clearDatabase = () => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM ${DB_TABLE}`, (err) => {
      if (err) {
        console.error('Failed to clear database:', err.message);
        return reject(err);
      }
      
      console.log('Database cleared successfully');
      resolve();
    });
  });
};
// ================================ [EoM] ================================ //

// ================================ [MODULE EXPORTS] ================================ //
module.exports = {
  saveToDatabase,
  getAllRecords,
  clearDatabase
};
// ================================ [EoF] ================================ //