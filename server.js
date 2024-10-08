// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Define allowed origins for CORS
const allowedOrigins = [
    'http://127.0.0.1:3001', // Local frontend
    'http://localhost:3000', // Local frontend alternative
    'https://alvinwelsh.vercel.app', // Deployed frontend
];

// CORS middleware setup
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy does not allow access from this origin.'), false);
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true, // Allow cookies or credentials
}));

// Middleware to handle JSON requests
app.use(express.json());

const filePath = path.join(__dirname, 'data.json');

// Initialize the data file if it doesn't exist
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
}

// Handle preflight requests explicitly for CORS
app.options('/save-data', cors());

// Handle form submission
app.post('/save-data', (req, res) => {
    const formData = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Error reading data file.' });

        let existingData = [];
        if (data.length > 0) {
            existingData = JSON.parse(data);
        }

        existingData.push(formData);

        fs.writeFile(filePath, JSON.stringify(existingData, null, 2), (err) => {
            if (err) return res.status(500).json({ message: 'Error saving data.' });

            res.status(200).json({ message: 'Form data saved successfully!' });
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
