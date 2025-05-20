const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// ================================ [MIDDLEWARE] ================================ //
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ================================ [CONNECT TO DATABASE] ================================ //
mongoose.connect('mongodb://localhost:27017/userFormDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(' MongoDB connection failed:', err.message));

// ================================ [API ROUTES] ================================ //
app.use('/api', apiRoutes);

// ================================ [FRONTED FALLBACK] ================================ //
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ================================ [START SERVER] ================================ //
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});

// ================================ [EoF] ================================ //

