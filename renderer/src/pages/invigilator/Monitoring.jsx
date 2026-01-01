import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Video, VideoOff, RefreshCw, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { PageHeader, PageContainer } from '../../components/common';

const Monitoring = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streamActive, setStreamActive] = useState(false);
  const [pythonServerStatus, setPythonServerStatus] = useState('checking');
  const [streamKey, setStreamKey] = useState(Date.now());
  const [isStreaming, setIsStreaming] = useState(false);
  const imgRef = useRef(null);

  const navigate = useNavigate();
  const toast = useToast();
  
  const PYTHON_SERVER_URL = 'http://localhost:5002';

  useEffect(() => {
    loadSelectedExam();
    checkPythonServer();
    
    // Cleanup: Stop stream when component unmounts
    return () => {
      stopStream();
    };
  }, []);

  const checkPythonServer = async () => {
    try {
      const response = await fetch(`${PYTHON_SERVER_URL}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        setPythonServerStatus('online');
        console.log('✅ Pose detection server online:', data);
      } else {
        setPythonServerStatus('offline');
        setStreamActive(false);
        setIsStreaming(false);
      }
    } catch (error) {
      console.error('❌ Python server not reachable:', error);
      setPythonServerStatus('offline');
      setStreamActive(false);
      setIsStreaming(false);
    }
  };

  const loadSelectedExam = () => {
    try {
      const examData = sessionStorage.getItem('selectedExam');
      if (examData) {
        setSelectedExam(JSON.parse(examData));
      } else {
        toast.error('No exam selected. Please select an exam first.');
        navigate('/invigilator/select-exam');
      }
    } catch (error) {
      console.error('Error loading selected exam:', error);
      toast.error('Failed to load exam');
      navigate('/invigilator/select-exam');
    } finally {
      setLoading(false);
    }
  };

  const stopStream = async () => {
    try {
      // Stop the stream by calling the stop endpoint
      await fetch(`${PYTHON_SERVER_URL}/stop_stream`, {
        method: 'POST',
        signal: AbortSignal.timeout(2000)
      });
      setIsStreaming(false);
      setStreamActive(false);
      toast.success('Camera stream stopped');
    } catch (error) {
      console.log('Stream stop request sent (may have already stopped)');
      setIsStreaming(false);
      setStreamActive(false);
    }
  };

  const startStream = async () => {
    try {
      checkPythonServer();
      setIsStreaming(true);
      setStreamActive(true);
      setStreamKey(Date.now());
      toast.success('Camera stream started');
    } catch (error) {
      console.error('Error starting stream:', error);
      toast.error('Failed to start stream');
    }
  };

  const handleRefreshStream = () => {
    setStreamKey(Date.now());
    checkPythonServer();
    toast.success('Stream refreshed');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monitoring...</p>
        </div>
      </div>
    );
  }

  if (!selectedExam) {
    return (
      <div className="min-h-screen bg-gray-100">
        <PageHeader title="Live Monitoring" backRoute="/invigilator/dashboard" />
        <div className="flex items-center justify-center p-16">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Exam Selected</h2>
            <p className="text-gray-600 mb-6">Please select an exam to begin monitoring</p>
            <button
              onClick={() => navigate('/invigilator/select-exam')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Select an Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <PageHeader title="Live Pose Detection Monitoring" backRoute="/invigilator/dashboard" />

      <PageContainer>
        {/* Server Status Banner */}
        <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
          pythonServerStatus === 'online' 
            ? 'bg-green-50 border-2 border-green-200' 
            : 'bg-red-50 border-2 border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            {pythonServerStatus === 'online' ? (
              <>
                <Video className="w-6 h-6 text-green-600" />
                <div>
                  <span className="text-green-800 font-semibold block">
                    ✅ AI Pose Detection Active
                  </span>
                  <span className="text-green-700 text-sm">
                    Real-time monitoring with suspicious behavior detection
                  </span>
                </div>
              </>
            ) : (
              <>
                <VideoOff className="w-6 h-6 text-red-600" />
                <div>
                  <span className="text-red-800 font-semibold block">
                    ❌ Pose Detection AI Offline
                  </span>
                  <span className="text-red-700 text-sm">
                    Start the Python server to enable live monitoring
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {pythonServerStatus === 'online' && (
              <>
                {isStreaming ? (
                  <button
                    onClick={stopStream}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    Stop Stream
                  </button>
                ) : (
                  <button
                    onClick={startStream}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start Stream
                  </button>
                )}
                <button
                  onClick={handleRefreshStream}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300 flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </>
            )}
            <button
              onClick={checkPythonServer}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                pythonServerStatus === 'online'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              Check Status
            </button>
          </div>
        </div>

        {/* Video Stream */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {isStreaming && streamActive && pythonServerStatus === 'online' ? (
            <div className="relative">
              <div className="aspect-video w-full bg-black">
                <img
                  key={streamKey}
                  src={`${PYTHON_SERVER_URL}/video_feed?t=${streamKey}`}
                  alt="Live Pose Detection Stream"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error('Stream error:', e);
                    setPythonServerStatus('offline');
                    setStreamActive(false);
                    toast.error('Stream connection lost');
                  }}
                />
              </div>
              {/* Live Indicator */}
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="font-semibold text-sm">LIVE</span>
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full bg-gray-900 flex items-center justify-center">
              <div className="text-center p-8">
                {pythonServerStatus === 'online' ? (
                  <>
                    <Video className="w-20 h-20 text-gray-500 mx-auto mb-6" />
                    <h3 className="text-gray-300 text-xl font-semibold mb-3">
                      Camera Stream Ready
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-md">
                      Click "Start Stream" button above to begin live pose detection monitoring.
                    </p>
                    <button
                      onClick={startStream}
                      className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg transition-colors flex items-center gap-3 mx-auto"
                    >
                      <Play className="w-6 h-6" />
                      Start Live Monitoring
                    </button>
                  </>
                ) : (
                  <>
                    <VideoOff className="w-20 h-20 text-gray-500 mx-auto mb-6" />
                    <h3 className="text-gray-300 text-xl font-semibold mb-3">
                      Camera Stream Unavailable
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-md">
                      The pose detection server is not running. Start it to enable live monitoring.
                    </p>
                    <div className="bg-gray-800 rounded-lg p-4 mb-4 max-w-lg mx-auto">
                      <p className="text-gray-400 text-sm mb-2">Start the server with:</p>
                      <code className="text-green-400 font-mono text-sm bg-gray-900 px-3 py-2 rounded block">
                        python backend/python_server.py
                      </code>
                    </div>
                    <button
                      onClick={checkPythonServer}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                      Check Again
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Detection Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-gray-600" />
            Detection Legend
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded border-2 border-green-600"></div>
              <div>
                <p className="font-semibold text-gray-800">Normal Behavior</p>
                <p className="text-sm text-gray-600">Student is focused on exam</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-yellow-500 rounded border-2 border-yellow-600"></div>
              <div>
                <p className="font-semibold text-gray-800">Suspicious Activity</p>
                <p className="text-sm text-gray-600">Head turned or looking away</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded border-2 border-red-600"></div>
              <div>
                <p className="font-semibold text-gray-800">High Suspicion</p>
                <p className="text-sm text-gray-600">Unusual body/shoulder movement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Info Card */}
        {selectedExam && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Exam</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Exam Title</p>
                <p className="font-semibold text-gray-800">{selectedExam.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-semibold text-gray-800">
                  {selectedExam.exam_date} at {selectedExam.exam_time}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-800">{selectedExam.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="font-semibold text-gray-800">{selectedExam.total_students}</p>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
};

export default Monitoring;

