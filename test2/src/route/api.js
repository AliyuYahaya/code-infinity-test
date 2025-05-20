const express = require('express');
const router = express.Router();
const { generateData } = require('../utils/generateData');
const { saveToDatabase, getAllRecords } = require('../database/actionsDB');
const { exportToOutput } = require('../database/exportToOutput');
const path = require('path');

// ================================ [GET CSV DOWNLOAD] ================================ //
router.get('/download-csv', async (req, res) => {
  try {
    // Set the path to your CSV file
    const csvFilePath = path.join(__dirname, '../outputs/output.csv');
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
    
    // Send the file
    res.download(csvFilePath, 'output.csv', (err) => {
      if (err) {
        console.error('Download error:', err);
        // If file doesn't exist yet
        if (!res.headersSent) {
          res.status(404).json({
            success: false,
            message: 'CSV file not found. Please generate data first.'
          });
        }
      }
    });
  } catch (err) {
    console.error('Error downloading CSV:', err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Error downloading CSV file.'
      });
    }
  }
});
// ================================ [EoM] ================================ //

// ================================ [RESET DATABASE FOR TESTING] ================================ //
router.delete('/reset-db', async (req, res) => {
  try {
    // Import your database functions that can clear tables
    const { clearDatabase } = require('../database/actionsDB');
    
    await clearDatabase();
    
    res.status(200).json({
      success: true,
      message: 'Database has been reset successfully.'
    });
  } catch (err) {
    console.error('Failed to reset database:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to reset database.'
    });
  }
});
// ================================ [EoM] ================================ //

// ================================ [GENERATE CSV DATA] ================================ //
router.post('/generate-csv', async (req, res) => {
  try {
    const { numOfRows } = req.body;
    
    // Validate input
    if (!numOfRows || isNaN(numOfRows) || numOfRows <= 0 || numOfRows > 1000000) {
      return res.status(400).json({
        success: false,
        message: 'Number of rows gotta be between 1 and 1,000,000'
      });
    }
    
    console.log(`Generating ${numOfRows} records...`);
    
    // 1. Generate the data
    const data = generateData(parseInt(numOfRows));
    
    // 2. Save to database
    await saveToDatabase(data);
    
    // 3. Get all records from the database
    const records = await getAllRecords();
    
    // 4. Export to CSV
    const csvPath = await exportToOutput(records);
    
    // 5. Return success
    res.status(200).json({
      success: true,
      message: `CSV with ${numOfRows}generated`,
      recordCount: records.length,
      csvPath: '/api/download-csv'
    });
  } catch (err) {
    console.error('Generation failure:', err);
    res.status(500).json({
      success: false,
      message: 'Generation Failed !!!!'
    });
  }
});
// ================================ [EoM] ================================ //

module.exports = router;
// ================================ [EoF] ================================ //