import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { examsApi } from '../../lib/api';
import { PageHeader, PageContainer, LoadingSpinner } from '../../components/common';

const SelectExam = () => {
  const [ongoingExams, setOngoingExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    loadOngoingExams();
    // Refresh every minute to check for new ongoing exams
    const interval = setInterval(loadOngoingExams, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadOngoingExams = async () => {
    try {
      // Get invigilator email from localStorage
      const invigilatorEmail = localStorage.getItem('invigilator_email');
      
      if (!invigilatorEmail) {
        // If no email found, redirect to login
        toast.error('Please login first');
        navigate('/invigilator-login');
        return;
      }

      const allExams = await examsApi.getAll();
      const ongoing = filterOngoingExams(allExams, invigilatorEmail);
      setOngoingExams(ongoing);
    } catch (error) {
      toast.error('Failed to load exams');
      console.error('Load exams error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOngoingExams = (exams, invigilatorEmail) => {
    const now = new Date();
    // Use local date instead of UTC to avoid timezone issues
    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`; // HH:MM

    return exams.filter(exam => {
      // Filter by invigilator email
      if (exam.invigilator_email !== invigilatorEmail) return false;

      // Only show scheduled exams
      if (exam.status !== 'scheduled') return false;

      // Check if exam is today
      if (exam.exam_date !== currentDate) return false;

      // Check if current time is between start and end time
      const startTime = exam.exam_time;
      const endTime = exam.end_time;

      if (!startTime || !endTime) return false;

      // Normalize time format (ensure HH:MM format for both)
      const normalizeTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${String(hours).padStart(2, '0')}:${String(minutes || '00').padStart(2, '0')}`;
      };

      const normalizedStartTime = normalizeTime(startTime);
      const normalizedEndTime = normalizeTime(endTime);

      return currentTime >= normalizedStartTime && currentTime <= normalizedEndTime;
    });
  };

  const handleSelectExam = (exam) => {
    // Store selected exam in sessionStorage for access across dashboard
    sessionStorage.setItem('selectedExam', JSON.stringify(exam));
    toast.success(`Selected: ${exam.title}`);
    navigate('/invigilator/dashboard');
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return time;
  };

  if (loading) {
    return <LoadingSpinner message="Checking for ongoing exams..." />;
  }

  const handleLogout = () => {
    localStorage.removeItem('invigilator_email');
    localStorage.removeItem('invigilator_name');
    toast.info('Logged out successfully');
    navigate('/invigilator-login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <PageHeader title="Select Ongoing Exam" backRoute="/" backText="Welcome Screen" />

      <PageContainer>
        <div className="max-w-5xl mx-auto">
          {/* Header Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  Current Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </h2>
                <p className="text-gray-600 mb-1">
                  Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm text-gray-500">
                  Logged in as: <span className="font-medium text-gray-700">{localStorage.getItem('invigilator_email')}</span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Change Invigilator
              </button>
            </div>
          </div>

          {/* Ongoing Exams List */}
          {ongoingExams.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="flex flex-col items-center">
                <Clock className="w-20 h-20 text-gray-300 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  No Ongoing Exams Right Now
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  There are currently no exams scheduled at this time. Please check back during exam hours or contact the admin for the exam schedule.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Welcome
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {ongoingExams.length} Ongoing {ongoingExams.length === 1 ? 'Exam' : 'Exams'}
                </h3>
                <p className="text-gray-600">Select an exam to monitor</p>
              </div>

              <div className="space-y-4">
                {ongoingExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-800 mb-3">
                            {exam.title}
                          </h4>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                              <span>
                                <span className="font-medium">Room:</span> {exam.venue}
                                {exam.section && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Section {exam.section}</span>}
                              </span>
                            </div>

                            <div className="flex items-center text-gray-600">
                              <Users className="w-5 h-5 mr-2 text-green-600" />
                              <span>
                                <span className="font-medium">Invigilator:</span> {exam.invigilator_email || 'Not assigned'}
                              </span>
                            </div>

                            <div className="flex items-center text-gray-600">
                              <Clock className="w-5 h-5 mr-2 text-orange-600" />
                              <span>
                                <span className="font-medium">Time:</span> {formatTime(exam.exam_time)} - {formatTime(exam.end_time)}
                              </span>
                            </div>

                            <div className="flex items-center text-gray-600">
                              <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                              <span>
                                <span className="font-medium">Department:</span> {exam.department || 'N/A'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              ● Ongoing Now
                            </span>
                            <span className="text-sm text-gray-500">
                              Status: {exam.status}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectExam(exam)}
                          className="ml-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                        >
                          Select Exam
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default SelectExam;

