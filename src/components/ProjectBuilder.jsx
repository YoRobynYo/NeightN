// ProjectBuilder.jsx
import React from 'react';
import './ProjectBuilder.css';

const ProjectBuilder = ({ projectTypes, onProjectSelect, onClose }) => {
  return (
    <div className="project-builder-overlay">
      <div className="project-builder">
        <div className="builder-header">
          <h2>Build Your Project</h2>
          <p>Choose a project type to get started with n8n</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="builder-content">
          {projectTypes.map(project => (
            <div 
              key={project.id}
              className="project-box"
              onClick={() => onProjectSelect(project)}
            >
              <div className="box-icon">{project.icon}</div>
              <div className="box-title">{project.title}</div>
              <div className="box-description">{project.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectBuilder;