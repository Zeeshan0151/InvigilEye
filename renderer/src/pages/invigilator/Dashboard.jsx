import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Camera, 
  MonitorPlay, 
  AlertTriangle,
  FileText,
  RefreshCw,
  Calendar,
  Clock,
  MapPin,
  Users
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    // Load selected exam from sessionStorage
    const examData = sessionStorage.getItem('selectedExam');
    if (examData) {
      setSelectedExam(JSON.parse(examData));
    }
  }, []);

  const dashboardCards = [
    {
      id: 1,
      title: 'View Attendance',
      description: 'Mark or update attendance manually in real-time.',
      icon: ClipboardCheck,
      bgColor: 'bg-blue-100',
      textColor: 'text-gray-800',
      route: '/invigilator/attendance'
    },
    {
      id: 2,
      title: 'View Snapshots',
      description: 'Browse captured evidence for suspicious behavior.',
      icon: Camera,
      bgColor: 'bg-green-100',
      textColor: 'text-gray-800',
      route: '/invigilator/snapshots'
    },
    {
      id: 3,
      title: 'View Stream',
      description: 'Monitor live student feed with red alert highlights.',
      icon: MonitorPlay,
      bgColor: 'bg-yellow-100',
      textColor: 'text-gray-800',
      route: '/invigilator/monitoring'
    },
    {
      id: 4,
      title: 'UMC Request',
      description: 'Report unfair means case with snapshot and note.',
      icon: AlertTriangle,
      bgColor: 'bg-pink-100',
      textColor: 'text-gray-800',
      route: '/invigilator/alerts'
    },
    {
      id: 5,
      title: 'Material Request',
      description: 'Request extra sheets or question papers instantly.',
      icon: FileText,
      bgColor: 'bg-purple-100',
      textColor: 'text-gray-800',
      route: '/invigilator/material-request'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-normal text-gray-700">
          Invigilator Dashboard - InvigilEye
        </h1>
      </div>

      {/* Selected Exam Info */}
      {selectedExam ? (
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold">{selectedExam.title}</h2>
                  <span className="px-3 py-1 bg-green-500 rounded-full text-sm font-medium">
                    Active Exam
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-blue-100">Room</p>
                      <p className="font-semibold">{selectedExam.venue}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-blue-100">Section</p>
                      <p className="font-semibold">{selectedExam.section || 'All'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-blue-100">Date</p>
                      <p className="font-semibold">{selectedExam.exam_date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <div>
                      <p className="text-xs text-blue-100">Time</p>
                      <p className="font-semibold">{selectedExam.exam_time} - {selectedExam.end_time}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/invigilator/select-exam')}
                className="ml-4 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Change Exam
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-yellow-800">
              No exam selected. Please select an ongoing exam to monitor.
            </p>
            <button
              onClick={() => navigate('/invigilator/select-exam')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Select Exam
            </button>
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* View Stream - Full Width at Top */}
        {dashboardCards
          .filter(card => card.id === 3)
          .map((card) => (
            <button
              key={card.id}
              onClick={() => navigate(card.route)}
              className={`${card.bgColor} p-10 rounded-2xl text-left transition-all duration-200 
                hover:shadow-md cursor-pointer border-0 w-full`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {card.title}
              </h2>
              <p className="text-gray-700 text-base leading-relaxed">
                {card.description}
              </p>
            </button>
          ))}

        {/* Remaining Cards - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dashboardCards
            .filter(card => card.id !== 3)
            .map((card) => (
              <button
                key={card.id}
                onClick={() => navigate(card.route)}
                className={`${card.bgColor} p-10 rounded-2xl text-left transition-all duration-200 
                  hover:shadow-md cursor-pointer border-0`}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {card.title}
                </h2>
                <p className="text-gray-700 text-base leading-relaxed">
                  {card.description}
                </p>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

