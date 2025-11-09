import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { PageHeader, PageContainer } from '../../components/common';

const Monitoring = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    loadSelectedExam();
  }, []);

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
      <PageHeader title="Live Monitoring" backRoute="/invigilator/dashboard" />

      <PageContainer>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-video w-full">
            <iframe
              src="https://www.youtube.com/embed/jfKfPfyJRdk"
              title="Live Monitoring Video"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default Monitoring;

