const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config({
  path: __dirname + '/.env'
});

console.log("ENV FILE EXISTS:", require('fs').existsSync(__dirname + '/.env'));
console.log("MONGO URI LOADED:", !!process.env.MONGO_URI);

const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/notes', require('./src/routes/noteRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Server startup failed:', err.message);
  });