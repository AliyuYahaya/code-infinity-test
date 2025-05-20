// ================================ [IMPORTS] ================================ //
// Need these modules to work with files and CSV generation
const fs = require('fs-extra');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Import our database functions to fetch the actual data
const { getAllRecords } = require('./actionsDB');
const { CSV_FILENAME } = require('../utils/constants');

// ================================ [CSV EXPORT FUNCTION] ================================ //
// This function pulls real data from the database and creates a CSV file
// Way better than the fake data we had before!
const exportToOutput = async () => {
  try {
    // First, get all the records from our database
    console.log('Fetching records from database...');
    const records = await getAllRecords();
    
    if (!records || records.length === 0) {
      throw new Error('No records found in the database to export');
    }
    
    // Set up the path where we'll save the CSV file
    const outputPath = path.join(__dirname, '../outputs', CSV_FILENAME);
    
    // Create the CSV writer with column definitions
    const csvWriter = createCsvWriter({
      path: outputPath,
      header: [
        { id: 'id', title: 'Id' },
        { id: 'name', title: 'Name' },
        { id: 'surname', title: 'Surname' },
        { id: 'initials', title: 'Initials' },
        { id: 'age', title: 'Age' },
        { id: 'dateOfBirth', title: 'DateOfBirth' }
      ]
    });
    
    // Write all the records to the CSV file
    console.log(`Writing ${records.length} records to CSV...`);
    await csvWriter.writeRecords(records);
    
    console.log(`CSV file with ${records.length} records saved to ${outputPath}`);
    
    // Return the file path so the caller knows where it went
    return outputPath;
  } catch (error) {
    console.error('Error exporting data to CSV:', error);
    throw error;
  }
};
// ================================ [EoM] ================================ //

// ================================ [MODULE EXPORTS] ================================ //
module.exports = {
  exportToOutput
};
// ================================ [EoF] ================================ //