#!/usr/bin/env python3
"""
Flask Video Streaming Server for Pose Detection
Integrates with the model/pose_estimation modules
"""

from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
import sys
import os
import time
from datetime import datetime

# Add model directory to Python path
model_path = os.path.join(os.path.dirname(__file__), '../model/pose_estimation')
sys.path.append(model_path)

# Import the pose detection modules
from behaviorAnalysis import BehavourAnalysis
from poseDetection import PoseDetection
from suspectDegree import suspectDegree

app = Flask(__name__)
CORS(app)

# Initialize components
behaviour_analysis = BehavourAnalysis()
pose_detector = PoseDetection()

# Configuration
FRAME_WIDTH = 1280
FRAME_HEIGHT = 720
CAMERA_SOURCE = 0
EXPRESS_API = 'http://localhost:5001/api'

# Global state
prev_poses = {}
alert_cooldown = {}  # Track last alert time per student
camera_active = {'status': False, 'cap': None}

def generate_frames():
    """Generate video frames with pose detection overlays"""
    global prev_poses, alert_cooldown, camera_active
    
    # Use existing camera or create new one
    if camera_active['cap'] is None or not camera_active['cap'].isOpened():
        cap = cv2.VideoCapture(CAMERA_SOURCE)
        
        if not cap.isOpened():
            print("❌ Error: Could not open camera")
            return
        
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)
        camera_active['cap'] = cap
        camera_active['status'] = True
        print("📹 Camera opened successfully, streaming frames...")
    else:
        cap = camera_active['cap']
    
    frame_count = 0
    
    try:
        while camera_active['status']:
            success, frame = cap.read()
            if not success:
                print("⚠️ Failed to read frame from camera")
                break
            
            frame_count += 1
            curr_poses = {}
            
            # Detect poses in current frame
            detected_poses, results = pose_detector.detect_pose(frame)
            
            # Analyze each detected person
            for idx, keypoints in enumerate(detected_poses):
                student_id = f"Student_{idx}"
                prev_keypoints = prev_poses.get(student_id)
                
                # Detect suspicious behavior
                sus_activities, sus_level = behaviour_analysis.detect_suspects(
                    keypoints, prev_keypoints
                )
                
                # Draw bounding box and label on frame
                draw_bounding_box(frame, student_id, keypoints, sus_level)
                
                # Handle alerts with cooldown (5 seconds between alerts per student)
                curr_time = time.time()
                last_alert_time = alert_cooldown.get(student_id, 0)
                
                if sus_level.value > suspectDegree.Normal.value:
                    if curr_time - last_alert_time > 5:
                        # Save snapshot
                        snapshot_path = save_snapshot(frame, student_id, sus_level)
                        
                        # Log alert
                        log_alert(student_id, sus_activities, sus_level, snapshot_path)
                        
                        # Update cooldown
                        alert_cooldown[student_id] = curr_time
                        
                        print(f"🚨 Alert: {student_id} - {sus_level.name} - {sus_activities}")
                
                curr_poses[student_id] = keypoints
            
            prev_poses = curr_poses.copy()
            
            # Encode frame to JPEG
            ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
            if not ret:
                continue
                
            frame_bytes = buffer.tobytes()
            
            # Yield frame in multipart format for streaming
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    
    except GeneratorExit:
        print("📹 Stream connection closed by client")
    finally:
        print("📹 Stream generator ended")


def draw_bounding_box(frame, student_id, keypoints, sus_level):
    """Draw bounding box around detected person with color based on suspicion level"""
    visible_kp = [kp for kp in keypoints.values() if kp["visible"]]
    if not visible_kp:
        return
    
    # Extract all coordinates of visible keypoints
    xs = [kp['x'] for kp in visible_kp]
    ys = [kp['y'] for kp in visible_kp]
    
    # Get frame dimensions
    h, w = frame.shape[:2]
    
    # Calculate bounding box
    x_min = max(0, int(min(xs)))
    x_max = min(w, int(max(xs)))
    y_min = max(0, int(min(ys)))
    y_max = min(h, int(max(ys)))
    
    # Set color based on suspicion level
    if sus_level == suspectDegree.Normal:
        color = (0, 255, 0)  # Green
        thickness = 2
    elif sus_level == suspectDegree.Suspect:
        color = (0, 255, 255)  # Yellow
        thickness = 3
    else:  # Hot_Suspect
        color = (0, 0, 255)  # Red
        thickness = 4
    
    # Draw rectangle
    cv2.rectangle(frame, (x_min, y_min), (x_max, y_max + 40), color, thickness)
    
    # Draw label
    label = f"{student_id}: {sus_level.name}"
    cv2.putText(
        frame, label, 
        (x_min, y_min - 10),
        cv2.FONT_HERSHEY_SIMPLEX, 
        0.6, color, 2
    )


def save_snapshot(frame, student_id, sus_level):
    """Save snapshot of suspicious activity"""
    # Create snapshots directory if it doesn't exist
    snapshot_dir = os.path.join(os.path.dirname(__file__), '../snapshots')
    os.makedirs(snapshot_dir, exist_ok=True)
    
    time_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{sus_level.name}_{student_id}_{time_str}.jpg"
    file_path = os.path.join(snapshot_dir, filename)
    
    cv2.imwrite(file_path, frame)
    return file_path


def log_alert(student_id, sus_activities, sus_level, snapshot_path):
    """Log alert to file"""
    log_dir = os.path.join(os.path.dirname(__file__), '../logs')
    os.makedirs(log_dir, exist_ok=True)
    
    log_file = os.path.join(log_dir, 'alerts.log')
    timestamp = datetime.now().isoformat()
    
    log_entry = f"{timestamp} - {student_id} - {sus_level.name} - {sus_activities} - {snapshot_path}\n"
    
    with open(log_file, "a") as f:
        f.write(log_entry)


@app.route('/video_feed')
def video_feed():
    """Video streaming route. Returns multipart JPEG stream"""
    return Response(
        generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )


@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'service': 'pose-detection-server',
        'model': 'YOLOv8s-pose',
        'port': 5002
    })


@app.route('/status')
def status():
    """Get current detection status"""
    return jsonify({
        'active_students': len(prev_poses),
        'alerts_today': len(alert_cooldown),
        'camera_active': camera_active['status']
    })


@app.route('/stop_stream', methods=['POST'])
def stop_stream():
    """Stop the camera stream and release resources"""
    global camera_active
    
    try:
        camera_active['status'] = False
        
        if camera_active['cap'] is not None:
            camera_active['cap'].release()
            camera_active['cap'] = None
            print("📹 Camera released successfully")
        
        return jsonify({
            'success': True,
            'message': 'Camera stream stopped'
        })
    except Exception as e:
        print(f"Error stopping stream: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/start_stream', methods=['POST'])
def start_stream():
    """Start the camera stream"""
    global camera_active
    
    try:
        camera_active['status'] = True
        return jsonify({
            'success': True,
            'message': 'Camera stream started'
        })
    except Exception as e:
        print(f"Error starting stream: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def cleanup():
    """Cleanup function to release camera on shutdown"""
    global camera_active
    if camera_active['cap'] is not None:
        print("\n📹 Releasing camera...")
        camera_active['cap'].release()
        camera_active['cap'] = None
        camera_active['status'] = False
        print("✅ Camera released successfully")


if __name__ == '__main__':
    import atexit
    atexit.register(cleanup)
    
    print("=" * 60)
    print("🚀 Starting Pose Detection Server")
    print("=" * 60)
    print(f"📹 Camera Source: {CAMERA_SOURCE}")
    print(f"🎥 Resolution: {FRAME_WIDTH}x{FRAME_HEIGHT}")
    print(f"🌐 Server: http://localhost:5002")
    print(f"📺 Video Feed: http://localhost:5002/video_feed")
    print(f"💚 Health Check: http://localhost:5002/health")
    print(f"🛑 Stop Stream: http://localhost:5002/stop_stream")
    print("=" * 60)
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    try:
        app.run(
            host='0.0.0.0',
            port=5002,
            debug=False,
            threaded=True,
            use_reloader=False
        )
    except KeyboardInterrupt:
        print("\n⚠️ Server interrupted by user")
        cleanup()
    finally:
        print("👋 Server stopped")

