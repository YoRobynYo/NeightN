import React, { useState } from 'react';
import './App.scss';

const mockWorkflows = [
  { id: 'youtube-tutorials', name: 'YouTube Tutorials', type: 'youtube' },
  { id: 'my-workflow-3', name: 'My workflow 3', type: 'workflow' },
];

function App() {
  const [activeSection, setActiveSection] = useState('youtube-tutorials');
  const [activeWorkflow, setActiveWorkflow] = useState('youtube-tutorials');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecuteWorkflow = () => {
    setIsExecuting(!isExecuting);
  };

  return (
    <div className="app">
      {/* Sidebar will go here */}
      <div style={{
        width: '280px',
        background: 'rgba(30, 27, 75, 0.9)',
        borderRight: '1px solid #475569',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#f8fafc'
      }}>
        <h3>Sidebar Placeholder</h3>
      </div>
      
      <div className="main-content">
        {/* Header will go here */}
        <div style={{
          height: '60px',
          background: 'rgba(49, 46, 129, 0.9)',
          borderBottom: '1px solid #475569',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f8fafc'
        }}>
          <h3>Header Placeholder</h3>
        </div>
        
        {/* Workflow Editor will go here */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f8fafc'
        }}>
          <h2>Workflow Editor Placeholder</h2>
        </div>
      </div>
    </div>
  );
}

export default App;