const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5001;

// Import routes
const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exams');
const requestRoutes = require('./routes/requests');
const reportRoutes = require('./routes/reports');
const attendanceRoutes = require('./routes/attendance');
const alertRoutes = require('./routes/alerts');
const poseDetectionRoutes = require('./routes/poseDetection');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create necessary directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const snapshotsDir = path.join(__dirname, '../snapshots');
const logsDir = path.join(__dirname, '../logs');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(snapshotsDir)) {
  fs.mkdirSync(snapshotsDir);
}
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Static files
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/pose-detection', poseDetectionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'InvigilEye backend is running' });
});

// Initialize database
const db = require('./database/db');
db.init();

app.listen(PORT, () => {
  console.log(`🚀 InvigilEye Backend running on http://localhost:${PORT}`);
});

module.exports = app;

