const express = require('express');
const cors = require('cors');
const path = require('path');
const feedController = require('./controllers/feedController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. API (Must come first!)
app.get('/feed', feedController.getFeed);
app.post('/add', feedController.addTopic);

// 2. Static Images
// Serves images at http://localhost:8000/feed/filename.png
app.use('/feed', express.static(path.join(__dirname, '../public/feed')));

// 3. Health Check
app.get('/', (req, res) => res.send('LifeFeed Phoenix API 🦅'));

module.exports = app; // Export for testing