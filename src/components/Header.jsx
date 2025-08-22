import React, { useState } from 'react';
import {
  Plus,
  Play,
  // Save,
  Share,
  Star,
  RotateCcw,
  MoreHorizontal,
  Youtube,
  FileText
} from 'lucide-react';

const Header = ({ activeWorkflow, workflows, onWorkflowChange, onExecuteWorkflow }) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="header">
      <div className="header-left">
        <div className="workflow-tabs">
          {workflows.map((workflow) => {
            const Icon = workflow.type === 'youtube' ? Youtube : FileText;
            return (
              <div
                key={workflow.id}
                className={`tab ${activeWorkflow === workflow.id ? 'active' : ''}`}
                onClick={() => onWorkflowChange(workflow.id)}
              >
                <Icon className="tab-icon" size={16} />
                <span>{workflow.name}</span>
              </div>
            );
          })}
          <div className="add-tab">
            <Plus size={16} />
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="toggle-switch">
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Inactive</span>
          <div 
            className={`switch ${isActive ? 'active' : ''}`}
            onClick={handleToggle}
          >
            <div className="switch-handle"></div>
          </div>
        </div>

        <button className="header-button">
          <Share className="button-icon" size={16} />
          <span>Share</span>
        </button>

        <button className="header-button primary" onClick={onExecuteWorkflow}>
          <Play className="button-icon" size={16} />
          <span>Save</span>
        </button>

        <button className="header-button">
          <RotateCcw className="button-icon" size={16} />
        </button>

        <button className="header-button">
          <MoreHorizontal className="button-icon" size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
          <Star size={16} style={{ color: '#fbbf24' }} />
          <span style={{ fontSize: '14px', fontWeight: '600' }}>94,680</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
