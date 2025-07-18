import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import mentorshipRoutes from './routes/mentorshipRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import imagekitRoutes from './routes/imagekitRoutes.js';



// Initialize env variables
dotenv.config();

// Connect to MongoDB
await connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://theincubator.netlify.app',
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/requests', mentorshipRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/imagekit', imagekitRoutes);



// Root route
app.get('/', (req, res) => {
  res.send('Mentorship Matching API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

