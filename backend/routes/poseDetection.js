const express = require('express');
const router = express.Router();
const db = require('../database/db');
const path = require('path');
const fs = require('fs');

/**
 * POST /api/pose-detection/alert
 * Receive alert from Python pose detection server
 */
router.post('/alert', (req, res) => {
  try {
    const { 
      student_id, 
      suspicious_activities, 
      suspicion_level, 
      snapshot_path,
      exam_id,
      timestamp 
    } = req.body;

    console.log(`🚨 Pose Detection Alert: ${student_id} - ${suspicion_level}`, suspicious_activities);

    // Store alert in database (using alerts table)
    const insertAlert = db.prepare(`
      INSERT INTO alerts (
        exam_id, 
        roll_number, 
        alert_type, 
        severity, 
        description, 
        timestamp,
        image_path,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const alert_type = suspicion_level === 'Hot_Suspect' ? 'cheating' : 'suspicious';
    const severity = suspicion_level === 'Hot_Suspect' ? 'high' : 'medium';
    const description = Array.isArray(suspicious_activities) 
      ? suspicious_activities.join(', ') 
      : suspicious_activities;

    const result = insertAlert.run(
      exam_id || null,
      student_id,
      alert_type,
      severity,
      description,
      timestamp || new Date().toISOString(),
      snapshot_path || null,
      'pending'
    );

    res.json({
      success: true,
      message: 'Alert received and stored',
      alert_id: result.lastInsertRowid
    });

  } catch (error) {
    console.error('Error storing pose detection alert:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/pose-detection/alerts/:examId
 * Get all pose detection alerts for an exam
 */
router.get('/alerts/:examId', (req, res) => {
  try {
    const { examId } = req.params;
    
    const alerts = db.prepare(`
      SELECT * FROM alerts 
      WHERE exam_id = ? 
      AND alert_type IN ('suspicious', 'cheating')
      ORDER BY timestamp DESC
    `).all(examId);

    res.json(alerts);
  } catch (error) {
    console.error('Error fetching pose detection alerts:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/pose-detection/stats/:examId
 * Get pose detection statistics for an exam
 */
router.get('/stats/:examId', (req, res) => {
  try {
    const { examId } = req.params;
    
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_alerts,
        SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) as high_severity,
        SUM(CASE WHEN severity = 'medium' THEN 1 ELSE 0 END) as medium_severity,
        COUNT(DISTINCT roll_number) as students_flagged
      FROM alerts
      WHERE exam_id = ? 
      AND alert_type IN ('suspicious', 'cheating')
    `).get(examId);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching pose detection stats:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/pose-detection/snapshot/:filename
 * Serve snapshot image
 */
router.get('/snapshot/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const snapshotPath = path.join(__dirname, '../../snapshots', filename);
    
    if (fs.existsSync(snapshotPath)) {
      res.sendFile(snapshotPath);
    } else {
      res.status(404).json({ error: 'Snapshot not found' });
    }
  } catch (error) {
    console.error('Error serving snapshot:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/pose-detection/snapshots
 * Get all snapshots with metadata
 */
router.get('/snapshots', (req, res) => {
  try {
    const snapshotsDir = path.join(__dirname, '../../snapshots');
    
    // Create snapshots directory if it doesn't exist
    if (!fs.existsSync(snapshotsDir)) {
      fs.mkdirSync(snapshotsDir, { recursive: true });
      return res.json([]);
    }
    
    // Read all files in snapshots directory
    const files = fs.readdirSync(snapshotsDir);
    
    // Filter for image files and extract metadata from filename
    const snapshots = files
      .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
      .map(filename => {
        const filePath = path.join(snapshotsDir, filename);
        const stats = fs.statSync(filePath);
        
        // Parse filename: Level_StudentID_Timestamp.jpg
        // Example: Hot_Suspect_Student_0_20260101_213419.jpg
        const parts = filename.replace('.jpg', '').split('_');
        let level = 'Unknown';
        let studentId = 'Unknown';
        let timestamp = '';
        
        if (filename.includes('Hot_Suspect')) {
          level = 'Hot_Suspect';
          studentId = parts[2] + '_' + parts[3]; // Student_0
          timestamp = parts[4] + '_' + parts[5]; // 20260101_213419
        } else if (filename.includes('Suspect')) {
          level = 'Suspect';
          studentId = parts[1] + '_' + parts[2]; // Student_0
          timestamp = parts[3] + '_' + parts[4]; // 20260101_213419
        } else {
          level = 'Normal';
          studentId = parts[1] + '_' + parts[2];
          timestamp = parts[3] + '_' + parts[4];
        }
        
        // Format timestamp
        const dateStr = timestamp.split('_')[0]; // 20260101
        const timeStr = timestamp.split('_')[1]; // 213419
        
        const formattedDate = `${dateStr.substring(0,4)}-${dateStr.substring(4,6)}-${dateStr.substring(6,8)}`;
        const formattedTime = `${timeStr.substring(0,2)}:${timeStr.substring(2,4)}:${timeStr.substring(4,6)}`;
        
        return {
          filename,
          level,
          student_id: studentId,
          timestamp: `${formattedDate} ${formattedTime}`,
          raw_timestamp: stats.mtime,
          size: stats.size,
          url: `/api/pose-detection/snapshot/${filename}`
        };
      })
      .sort((a, b) => new Date(b.raw_timestamp) - new Date(a.raw_timestamp)); // Sort by newest first
    
    res.json(snapshots);
  } catch (error) {
    console.error('Error listing snapshots:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

