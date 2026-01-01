import React, { useState, useEffect } from 'react';
import { Camera, Download, AlertTriangle, Activity, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { PageHeader, PageContainer } from '../../components/common';

const Snapshots = () => {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, Hot_Suspect, Suspect, Normal

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    loadSnapshots();
  }, []);

  const loadSnapshots = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/pose-detection/snapshots');
      
      if (!response.ok) {
        throw new Error('Failed to load snapshots');
      }
      
      const data = await response.json();
      setSnapshots(data);
    } catch (error) {
      console.error('Error loading snapshots:', error);
      toast.error('Failed to load snapshots');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (snapshot) => {
    try {
      toast.info('Downloading snapshot...');
      const response = await fetch(`http://localhost:5001${snapshot.url}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = snapshot.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Snapshot downloaded successfully');
    } catch (error) {
      console.error('Error downloading snapshot:', error);
      toast.error('Failed to download snapshot');
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Hot_Suspect':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
      case 'Suspect':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
      default:
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
    }
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 'Hot_Suspect':
        return 'High Suspicion';
      case 'Suspect':
        return 'Suspicious';
      default:
        return 'Normal';
    }
  };

  const filteredSnapshots = filter === 'all'
    ? snapshots
    : snapshots.filter(s => s.level === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <PageHeader title="Snapshot Gallery" backRoute="/invigilator/dashboard" />
        <PageContainer>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading snapshots...</p>
            </div>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <PageHeader 
        title="Snapshot Gallery" 
        backRoute="/invigilator/dashboard"
      />

      <PageContainer>
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Header with filters */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              All Snapshots ({filteredSnapshots.length})
            </h2>
            <button
              onClick={loadSnapshots}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({snapshots.length})
            </button>
            <button
              onClick={() => setFilter('Hot_Suspect')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'Hot_Suspect'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              High Suspicion ({snapshots.filter(s => s.level === 'Hot_Suspect').length})
            </button>
            <button
              onClick={() => setFilter('Suspect')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'Suspect'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-1" />
              Suspicious ({snapshots.filter(s => s.level === 'Suspect').length})
            </button>
          </div>
          
          {filteredSnapshots.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No snapshots captured yet</p>
              <p className="text-sm text-gray-400">
                Snapshots will appear here when suspicious behavior is detected
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSnapshots.map((snapshot) => {
                const levelColor = getLevelColor(snapshot.level);
                return (
                  <div
                    key={snapshot.filename}
                    className={`border-2 ${levelColor.border} rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white`}
                  >
                    {/* Actual Snapshot Image */}
                    <div className="aspect-video bg-black relative overflow-hidden">
                      <img
                        src={`http://localhost:5001${snapshot.url}`}
                        alt={`Snapshot of ${snapshot.student_id}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = '';
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div>';
                        }}
                      />
                      {/* Level Badge */}
                      <div className={`absolute top-2 right-2 ${levelColor.bg} ${levelColor.text} px-3 py-1 rounded-full text-xs font-semibold`}>
                        {getLevelLabel(snapshot.level)}
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{snapshot.student_id}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Captured:</span> {snapshot.timestamp}
                        </p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(snapshot)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default Snapshots;

