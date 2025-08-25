// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import ProjectBuilder from './ProjectBuilder'; 
import Workspace from './Workspace'; 
import Sidebar from './Sidebar';

const Dashboard = () => {
  console.log('🔥 Dashboard component is rendering!');
  
  const [showProjectBuilder, setShowProjectBuilder] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

  // Debug effect
  useEffect(() => {
    console.log('showProjectBuilder changed:', showProjectBuilder);
    console.log('activeProject changed:', activeProject);
  }, [showProjectBuilder, activeProject]);

  // Test direct state change
  useEffect(() => {
    console.log('Dashboard component mounted');
    
    // Test if setShowProjectBuilder works directly
    const testDirectChange = () => {
      console.log('Testing direct state change...');
      setShowProjectBuilder(true);
    };
    
    // Test after 2 seconds
    const timer = setTimeout(testDirectChange, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Event listener for sidebar "Create Project" button
  useEffect(() => {
    const handleOpenBuilder = (event) => {
      console.log('openProjectBuilder event received!', event);
      setShowProjectBuilder(true);
    };
    
    console.log('Setting up event listener for openProjectBuilder');
    window.addEventListener('openProjectBuilder', handleOpenBuilder);
    
    return () => {
      console.log('Cleaning up event listener');
      window.removeEventListener('openProjectBuilder', handleOpenBuilder);
    };
  }, []);

  const projectTypes = [
    {
      id: 'workflow',
      icon: '🔄',
      title: 'Workflow Project',
      description: 'Build automated workflows with AI agents and integrations'
    },
    {
      id: 'ai-agent',
      icon: '🤖',
      title: 'AI Agent',
      description: 'Create intelligent agents for customer support and automation'
    },
    {
      id: 'integration',
      icon: '🔗',
      title: 'Integration',
      description: 'Connect external services and APIs to your workflow'
    },
    {
      id: 'dashboard',
      icon: '📊',
      title: 'Dashboard',
      description: 'Monitor and analyze your project performance'
    }
  ];

  const handleProjectSelect = (project) => {
    console.log('Project selected:', project.title);
    setActiveProject(project);
    setShowProjectBuilder(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="logo">n8n</div>
        <div className="user-info">
          <span>Welcome Alec!</span>
          <div className="user-avatar">A</div>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Prod. executions</div>
          <div className="stat-period">Last 7 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0</div>
          <div className="stat-label">Failed prod. executions</div>
          <div className="stat-period">Last 7 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0%</div>
          <div className="stat-label">Failure rate</div>
          <div className="stat-period">Last 7 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">-</div>
          <div className="stat-label">Time saved</div>
          <div className="stat-period">Last 7 days</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">0s</div>
          <div className="stat-label">Run tik</div>
          <div className="stat-period">Last 7 days</div>
        </div>
      </div>

      {/* Debug info */}
      <div style={{color: 'red', padding: '10px', background: '#222', marginBottom: '15px'}}>
        Debug: showProjectBuilder = {showProjectBuilder.toString()}, activeProject = {activeProject ? activeProject.title : 'null'}
      </div>

      {/* Test button to verify event system */}
      <button 
        onClick={() => {
          console.log('Test: Dispatching openProjectBuilder event manually');
          window.dispatchEvent(new CustomEvent('openProjectBuilder'));
        }}
        style={{margin: '10px', padding: '5px', backgroundColor: 'orange', color: 'black'}}
      >
        TEST: Fire Event Manually
      </button>

      <div 
        className="add-project-button"
        onClick={() => {
          console.log('Add project button clicked!');
          setShowProjectBuilder(true);
        }}
        style={{ cursor: 'pointer' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus" aria-hidden="true">
          <path d="M5 12h14"></path>
          <path d="M12 5v14"></path>
        </svg>
        <span>Add project</span>
      </div>

      <div className="tabs">
        <div className="tab active">Workflows</div>
        <div className="tab">Credentials</div>
        <div className="tab">Executions</div>
      </div>

      {!activeProject && !showProjectBuilder && (
        <div className="welcome-message">
          <h2>Welcome Alec!</h2>
          <p>Create your first workflow</p>
        </div>
      )}

      {showProjectBuilder && (
        <ProjectBuilder 
          projectTypes={projectTypes}
          onProjectSelect={handleProjectSelect}
          onClose={() => setShowProjectBuilder(false)}
        />
      )}

      {activeProject && (
        <Workspace 
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}

      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onAddProject={() => {
          console.log('Add project from sidebar clicked!');
          setShowProjectBuilder(true);
        }}
      />
    </div>
  );
};

export default Dashboard;