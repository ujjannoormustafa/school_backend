const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://ujjan:BbsA6jwwtZzXWBIn@cluster0.vbu4qnb.mongodb.net/School?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true, // Added for index creation
    useFindAndModify: false // Added to disable deprecated functions
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define Schema and Model for MongoDB
const { Schema } = mongoose;
const schoolSchema = new Schema({
    name: { type: String, required: true }, // Added validation for required fields
    detail: { type: String, maxLength: 250 }, // Added validation for maximum length
    imageUrl: { type: String, required: true } // Added validation for required fields
});
const School = mongoose.model('School', schoolSchema);

// API Endpoints
app.post('/api/schools', async (req, res) => {
    try {
        const { name, detail, imageUrl } = req.body;
        const school = new School({ name, detail, imageUrl });
        await school.save();
        res.status(201).json(school);
    } catch (error) {
        console.error('Error creating school:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/schools', async (req, res) => {
    try {
        const schools = await School.find().lean(); // Using lean() for faster data retrieval
        res.json(schools);
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
