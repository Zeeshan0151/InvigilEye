import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { examsApi } from '../lib/api';

const InvigilatorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch exams for this invigilator
      const response = await fetch(`http://localhost:5001/api/exams/invigilator/${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exams');
      }

      const exams = await response.json();

      // Get current date and time
      const now = new Date();
      const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // Filter for ongoing exams (scheduled status, today's date, and within time window)
      const ongoingExams = exams.filter(exam => {
        if (exam.status !== 'scheduled' || exam.exam_date !== currentDate) return false;
        
        const startTime = exam.exam_time;
        const endTime = exam.end_time;
        
        if (!startTime || !endTime) return false;
        
        const normalizeTime = (time) => {
          const [hours, minutes] = time.split(':');
          return `${String(hours).padStart(2, '0')}:${String(minutes || '00').padStart(2, '0')}`;
        };
        
        const normalizedStartTime = normalizeTime(startTime);
        const normalizedEndTime = normalizeTime(endTime);
        
        return currentTime >= normalizedStartTime && currentTime <= normalizedEndTime;
      });

      if (ongoingExams.length === 0) {
        // No ongoing exam found - navigate to "no exam" screen
        localStorage.setItem('invigilator_email', email);
        navigate('/invigilator/no-exam');
        return;
      }

      // Store invigilator email and exam in localStorage
      localStorage.setItem('invigilator_email', email);
      localStorage.setItem('invigilator_name', email.split('@')[0]); // Use email prefix as name
      
      // Store the exam in sessionStorage
      sessionStorage.setItem('selectedExam', JSON.stringify(ongoingExams[0]));

      toast.success(`Welcome! Starting exam: ${ongoingExams[0].title}`);
      navigate('/invigilator/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-200 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Login Card */}
        <div className="bg-slate-500 rounded-3xl shadow-2xl p-12">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-green-200 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>

          {/* Title */}
          <h1 className="text-4xl font-bold text-white text-center mb-3">
            Invigilator Login
          </h1>
          <p className="text-white/70 text-center mb-12">
            Enter your email to access ongoing exams
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 px-6 rounded-full bg-neutral-300 text-gray-700 text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              required
            />

            {/* Bottom Section */}
            <div className="flex items-center justify-end pt-4">
              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-lg font-medium rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'LOADING...' : 'CONTINUE'}
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-xs text-white/70 text-center">
              Only ongoing exams for today will be shown
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvigilatorLoginPage;

