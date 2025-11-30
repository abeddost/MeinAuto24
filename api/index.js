const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
const apiRoutes = require('../routes/api');
app.use('/api', apiRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/impressum', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/impressum.html'));
});

app.get('/datenschutz', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/datenschutz.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Ein Fehler ist aufgetreten.' 
    });
});

// Export for Vercel serverless function
module.exports = app;

