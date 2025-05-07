require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', bookRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Bookstore API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
