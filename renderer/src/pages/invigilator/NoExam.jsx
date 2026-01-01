import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';
import { PageHeader, PageContainer } from '../../components/common';

const NoExam = () => {
  const navigate = useNavigate();
  const invigilatorEmail = localStorage.getItem('invigilator_email');

  const handleLogout = () => {
    localStorage.removeItem('invigilator_email');
    localStorage.removeItem('invigilator_name');
    navigate('/invigilator-login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <PageHeader title="Invigilator Dashboard" backRoute="/" backText="Welcome Screen" />

      <PageContainer>
        <div className="max-w-4xl mx-auto">
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
                  Logged in as: <span className="font-medium text-gray-700">{invigilatorEmail}</span>
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

          {/* No Exam Message */}
          <div className="bg-white rounded-lg shadow-sm p-12">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-12 h-12 text-gray-400" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                No Ongoing Exam Right Now
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-8 max-w-2xl">
                There are currently no exams scheduled at this time for your account. 
                Please check back during exam hours or contact the admin for your exam schedule.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default NoExam;

