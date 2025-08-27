// ActionButtons.jsx
import React, { useState, useEffect } from 'react';

const ActionButtons = ({ 
  onOpenNodesPanel, 
  onCopy, 
  onToggleCollapse,
  onToggleAI,
  isSidebarCollapsed = false
}) => {
  const [showTooltip, setShowTooltip] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        onOpenNodesPanel();
      } else if (e.key === 'F' && e.shiftKey) {
        e.preventDefault();
        onToggleCollapse();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpenNodesPanel, onToggleCollapse]);

  const actionButtonsStyle = {
    position: 'fixed',
    right: isSidebarCollapsed ? '80px' : '300px',
    top: '150px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 15,
    pointerEvents: 'auto',
  };

  const actionBtnStyle = {
    width: '48px',
    height: '48px',
    background: 'rgba(42, 42, 53, 0.95)',
    border: '1px solid #3a3a4a',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
    color: '#e1e1e1',
    position: 'relative',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  };

  const highlightedStyle = {
    ...actionBtnStyle,
    background: '#f56565',
    color: 'white',
  };

  const aiBtnStyle = {
    ...actionBtnStyle,
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: 'white',
  };

  const tooltipStyle = {
    position: 'absolute',
    right: '60px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0, 0, 0, 0.9)',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    opacity: showTooltip ? 1 : 0,
    pointerEvents: 'none',
    transition: 'opacity 0.2s',
    zIndex: 20,
  };

  return (
    <div style={actionButtonsStyle}>
      <div
        style={highlightedStyle}
        onClick={onOpenNodesPanel}
        onMouseEnter={() => setShowTooltip('nodes')}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <span style={{ fontSize: '24px' }}>+</span>
        {showTooltip === 'nodes' && (
          <div style={tooltipStyle}>Open nodes panel (Tab)</div>
        )}
      </div>

      <div
        style={actionBtnStyle}
        onClick={onCopy}
        onMouseEnter={() => setShowTooltip('copy')}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <span style={{ fontSize: '18px' }}>📄</span>
        {showTooltip === 'copy' && (
          <div style={tooltipStyle}>Copy</div>
        )}
      </div>

      <div
        style={actionBtnStyle}
        onClick={onToggleCollapse}
        onMouseEnter={() => setShowTooltip('sidebar')}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <span style={{ fontSize: '16px' }}>⊞</span>
        {showTooltip === 'sidebar' && (
          <div style={tooltipStyle}>Toggle Sidebar (↑F)</div>
        )}
      </div>

      <div
        style={aiBtnStyle}
        onClick={onToggleAI}
        onMouseEnter={() => setShowTooltip('ai')}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <span style={{ fontSize: '18px' }}>✨</span>
        {showTooltip === 'ai' && (
          <div style={tooltipStyle}>AI Assistant</div>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;