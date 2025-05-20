const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');

// ================================ [REQUEST LOGGING MIDDLEWARE] ================================ //
const logStuff = (req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  next();
};

// ================================ [ERROR HANDLING MIDDLEWARE] ================================ //
const catchServerFires = (err, req, res, next) => {
  console.error('Server blew up:', err);
  res.status(500).json({
    error: true,
    message: 'Something went wrong on our end',
    // Only show error details during development
    details: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
};

const app = express();
const PORT = process.env.PORT || 3000; // Default to 3000 if not specified

// ================================ [MIDDLEWARE SETUP] ================================ //
app.use(logStuff); // Log all incoming requests
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// ================================ [OUTPUT DIRECTORY SETUP] ================================ //
try {
  fs.ensureDirSync(path.join(__dirname, 'src/outputs'));
  console.log('CSV output directory ready');
} catch (err) {
  console.error('Failed to create outputs directory:', err);
  // Not fatal, but might cause issues later when trying to write files
}


// ================================ [TEST ENDPOINT] ================================ //
// Just a simple endpoint to check if the API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Yep, API is working!' });
});
// ================================ [EoM] ================================ //

// ================================ [RESET DATABASE] ================================ //
// Utility endpoint to clear all data from the database
// Useful for testing and debugging
app.delete('/api/reset-db', async (req, res) => {
  try {
    // Import the clearDatabase function from actionsDB
    const { clearDatabase } = require('./src/database/actionsDB');
    
    // Clear all data from the database
    await clearDatabase();
    
    // Let the user know it worked
    res.status(200).json({
      success: true,
      message: 'Database has been reset successfully.'
    });
  } catch (err) {
    console.error('Failed to reset database:', err);
    
    // Return an error response
    res.status(500).json({
      success: false,
      message: 'Failed to reset database.'
    });
  }
});
// ================================ [EoM] ================================ //

// ================================ [CSV GENERATION ENDPOINT] ================================ //
// This endpoint generates the CSV data based on user's request
// It's the main endpoint that kicks off the whole process
app.post('/api/generate-csv', async (req, res) => {
  try {
    // What did the user send us?
    const userInput = req.body;
    console.log('Got request to generate CSV:', userInput);
    
    // Make sure we have a valid row count
    const rowCount = parseInt(userInput.numOfRows);
    
    // Some basic validation
    if (!rowCount) {
      return res.status(400).json({
        success: false,
        message: 'Hey, I need a valid number of rows!'
      });
    }
    
    if (rowCount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Row count needs to be positive - what would I even generate otherwise?'
      });
    }
    
    if (rowCount > 1000000) {
      return res.status(400).json({
        success: false,
        message: 'Whoa there! Maximum is 1,000,000 rows. My poor server would melt.'
      });
    }
    
    // Let's actually generate the data now
    console.log(`Starting to generate ${rowCount} records...`);
    const { generateData } = require('./src/utils/generateData');
    const randomPeople = generateData(rowCount);
    console.log(`DEBUGGING: Generated ${randomPeople.length} records in memory`);
    
    // Save the generated data to the database
    console.log('Saving data to database...');
    const { saveToDatabase } = require('./src/database/actionsDB');
    await saveToDatabase(randomPeople);
    
    // Check if the data was properly saved in the database
    const { getAllRecords } = require('./src/database/actionsDB');
    const savedRecords = await getAllRecords();
    console.log(`DEBUGGING: There are ${savedRecords.length} records in the database after saving`);    
    
    // Export the saved data to a CSV file
    console.log('Exporting data to CSV...');
    const { exportToOutput } = require('./src/database/exportToOutput');
    const csvPath = await exportToOutput();
    
    // Check the CSV file again
    const { CSV_FILENAME } = require('./src/utils/constants');
    const csvFilePath = path.join(__dirname, 'src', 'outputs', CSV_FILENAME);
    
    if (fs.existsSync(csvFilePath)) {
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvContent.split('\n');
      const lineCount = lines.length - 1; // -1 for header row
      
      console.log(`DEBUGGING: CSV file contains ${lineCount} data rows`);
      console.log(`DEBUGGING: First 5 lines of CSV:`);
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        console.log(`  ${lines[i]}`);
      }
    }  
    
    // All done! Let the user know it worked
    console.log(`Successfully generated ${rowCount} records and saved to CSV`);
    res.status(200).json({
      success: true,
      message: `Sweet! Generated ${rowCount} records for you.`,
      recordCount: rowCount,
      csvPath: '/api/download-csv'
    });
  } catch (err) {
    // Something unexpected happened
    console.error('Oops, CSV generation failed:', err);
    res.status(500).json({
      success: false,
      message: 'Sorry, something broke while generating your CSV'
    });
  }
});
// ================================ [EoM] ================================ //

// ================================ [CSV DOWNLOAD ENDPOINT] ================================ //
// Serves the generated CSV file to the user for download
// This endpoint reads from the actual file, not fake data
app.get('/api/download-csv', (req, res) => {
  try {
    // Get the path to our CSV file
    const { CSV_FILENAME } = require('./src/utils/constants');
    const csvFilePath = path.join(__dirname, 'src', 'outputs', CSV_FILENAME);
    
    // Check if the file exists
    if (!fs.existsSync(csvFilePath)) {
      return res.status(404).json({
        success: false,
        message: 'CSV file not found. Generate data first!'
      });
    }
    
    // Tell the browser this is a CSV file to download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${CSV_FILENAME}`);
    
    // Stream the file to the client
    const fileStream = fs.createReadStream(csvFilePath);
    fileStream.pipe(res);
  } catch (err) {
    // Had trouble getting the CSV
    console.error('Failed to serve CSV file:', err);
    res.status(500).json({
      success: false,
      message: 'Could not download the CSV file - did you generate it first?'
    });
  }
});
// ================================ [EoM] ================================ //

// ================================ [INDEX PAGE ROUTE] ================================ //
// Serves the main HTML page when users visit the site
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// ================================ [EoM] ================================ //

// ================================ [ERROR HANDLER] ================================ //
// Catches any errors that occur in the routes
app.use(catchServerFires);
// ================================ [EoM] ================================ //

// ================================ [SERVER STARTUP] ================================ //
// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log('\n===========================================');
  console.log(`CSV Generator ready at http://localhost:${PORT}`);
  console.log('===========================================\n');
  console.log('Available endpoints:');
  console.log('  GET  /');
  console.log('  GET  /api/test');
  console.log('  POST /api/generate-csv');
  console.log('  GET  /api/download-csv');
  console.log('  DELETE /api/reset-db');
  console.log('===========================================\n');
});
// ================================ [EoM] ================================ //

// ================================ [END OF FILE] ================================ //

