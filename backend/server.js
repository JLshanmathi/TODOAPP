// Load dotenv FIRST
const dotenv = require('dotenv');
dotenv.config();

console.log('🔧 Environment Check:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✓ Found' : '✗ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✓ Found' : '✗ Missing');

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Routes
app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: 'Todo API is running',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));