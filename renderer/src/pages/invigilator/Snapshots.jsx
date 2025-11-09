import React, { useState } from 'react';
import { Camera, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { PageHeader, PageContainer } from '../../components/common';

const Snapshots = () => {
  const [snapshots, setSnapshots] = useState([
    { id: 1, timestamp: '2025-10-21 10:30:45', camera: 'Camera 1', description: 'Suspicious activity detected' },
    { id: 2, timestamp: '2025-10-21 10:45:12', camera: 'Camera 2', description: 'Unauthorized face detected' },
    { id: 3, timestamp: '2025-10-21 11:15:33', camera: 'Camera 3', description: 'Multiple faces in frame' },
    { id: 4, timestamp: '2025-10-21 11:30:22', camera: 'Camera 1', description: 'Student looking away' },
    { id: 5, timestamp: '2025-10-21 12:00:15', camera: 'Camera 4', description: 'Movement detected' },
    { id: 6, timestamp: '2025-10-21 12:25:40', camera: 'Camera 2', description: 'Unknown person in frame' },
  ]);

  const navigate = useNavigate();
  const toast = useToast();

  const handleDownload = (snapshot) => {
    toast.info(`Downloading snapshot...`);
    setTimeout(() => {
      toast.success('Snapshot downloaded');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <PageHeader 
        title="Snapshot Gallery" 
        backRoute="/invigilator/dashboard"
      />

      <PageContainer>
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All Snapshots ({snapshots.length})</h2>
          
          {snapshots.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No snapshots captured yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Placeholder Image */}
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative">
                    <Camera className="w-12 h-12 text-gray-500" />
                  </div>
                  
                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{snapshot.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{snapshot.timestamp}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(snapshot)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-700"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default Snapshots;

