// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Use CORS to allow requests from other origins
app.use(cors({
    origin: ['http://127.0.0.1:3000', 'https://contact-form-backend-jj5v06od8-alvin-welshs-projects.vercel.app'] // Allow both origins
}));
app.use(express.json());

const filePath = path.join(__dirname, 'data.json');

// Initialize the data file if it doesn't exist
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
}

// Handle preflight requests
app.options('/save-data', cors()); // Handle OPTIONS requests for CORS

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
