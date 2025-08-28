import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PanelManager from './PanelManager';

const RightSidebar = ({
  onAddNode,
  onStartDragNewNode,
  isCollapsed,
  onToggleCollapse,
  openPanel1Trigger
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Debug logging
  console.log('RightSidebar state:', { isPanelOpen, isCollapsed, openPanel1Trigger });

  // + button - always OPENS the panel
  useEffect(() => {
    if (openPanel1Trigger) {
      setIsPanelOpen(true);
      
      // If sidebar is collapsed, expand it first
      if (isCollapsed) {
        onToggleCollapse();
      }
    }
  }, [openPanel1Trigger, isCollapsed, onToggleCollapse]);

  // Close panel when sidebar collapses
  useEffect(() => {
    if (isCollapsed) {
      setIsPanelOpen(false);
    }
  }, [isCollapsed]);

  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      width: isCollapsed ? '0px' : '300px',
      height: '100vh',
      backgroundColor: '#1f1f2e',
      zIndex: 1000,
      padding: isCollapsed ? '0px' : '20px',
      color: '#fff',
      transition: 'width 0.3s ease',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {isPanelOpen && (
        <PanelManager 
          openPanelIndex={0}
          onAddNode={onAddNode}
          onStartDragNewNode={onStartDragNewNode}
        />
      )}
    </div>
  );
};

RightSidebar.propTypes = {
  onAddNode: PropTypes.func.isRequired,
  onStartDragNewNode: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func.isRequired,
  openPanel1Trigger: PropTypes.bool,
};

export default RightSidebar;