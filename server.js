// Load environment variables FIRST, before any other requires
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve Impressum page
app.get('/impressum', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'impressum.html'));
});

// Serve Datenschutz page
app.get('/datenschutz', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'datenschutz.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Ein Fehler ist aufgetreten.' 
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server läuft auf Port ${PORT}`);
    console.log(`🌐 Öffne http://localhost:${PORT} im Browser`);
});

