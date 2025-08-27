import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WorkflowEditor from './components/WorkflowEditor';
import ProjectBuilder from './components/ProjectBuilder';
import './App.scss';

const mockWorkflows = [
  { id: 'youtube-tutorials', name: 'YouTube Tutorials', type: 'youtube' },
  { id: 'my-workflow-3', name: 'My workflow 3', type: 'workflow' },
];

function App() {
  const [activeSection, setActiveSection] = useState('youtube-tutorials');
  const [activeWorkflow, setActiveWorkflow] = useState('youtube-tutorials');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showProjectBuilder, setShowProjectBuilder] = useState(false);
  const [projects, setProjects] = useState(mockWorkflows);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    const handleOpenBuilder = () => {
      console.log('openProjectBuilder event received in App!');
      setShowProjectBuilder(true);
    };
    
    window.addEventListener('openProjectBuilder', handleOpenBuilder);
    return () => window.removeEventListener('openProjectBuilder', handleOpenBuilder);
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
    }
  ];

  const handleProjectSelect = (project) => {
    console.log('Project selected:', project.title);
    
    if (project.id === 'workflow') {
      // Create a new workflow project
      const newProject = {
        id: `workflow-${Date.now()}`,
        name: 'New Workflow',
        type: 'workflow',
        nodes: [],
        edges: []
      };
      
      setProjects([...projects, newProject]);
      setCurrentProject(newProject);
      setActiveWorkflow(newProject.id);
    }
    
    setShowProjectBuilder(false);
  };

  const handleExecuteWorkflow = async () => {
    setIsExecuting(true);
    try {
      const response = await fetch('http://127.0.0.1:5001/api/test');
      const data = await response.json();
      console.log('Backend response:', data);
    } catch (error) {
      console.error('Backend connection failed:', error);
    }
    setIsExecuting(false);
  };

  const handleSaveWorkflow = (workflowData) => {
    if (currentProject) {
      // Update the current project with new workflow data
      const updatedProjects = projects.map(project =>
        project.id === currentProject.id
          ? { ...project, ...workflowData }
          : project
      );
      setProjects(updatedProjects);
      console.log('Workflow saved:', workflowData);
    }
  };

  return (
    <div className="app">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <div className="main-content">
        <Header 
          activeWorkflow={activeWorkflow}
          workflows={projects}
          onWorkflowChange={setActiveWorkflow}
          onExecuteWorkflow={handleExecuteWorkflow}
        />

        <WorkflowEditor 
          isExecuting={isExecuting}
          onNodeStatusChange={(nodeId, status) => {
            console.log(`Node ${nodeId} status: ${status}`);
          }}
          showProjectBuilder={showProjectBuilder}
          projectData={currentProject}
          onSave={handleSaveWorkflow}
          projectTypes={projectTypes}
          onProjectSelect={handleProjectSelect}
          onCloseProjectBuilder={() => setShowProjectBuilder(false)}
        />
      </div>
      
      {showProjectBuilder && (
        <ProjectBuilder 
          projectTypes={projectTypes}
          onProjectSelect={handleProjectSelect}
          onClose={() => setShowProjectBuilder(false)}
        />
      )}
    </div>
  );
}

export default App;