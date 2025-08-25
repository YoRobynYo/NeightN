import React, { useState, useCallback, useMemo } from 'react';

const RightSidebar = ({ onAddNode, onStartDragNewNode, isCollapsed, onToggleCollapse }) => {
  const [draggedNode, setDraggedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Memoized node types with icons for better performance
  const nodeTypes = useMemo(() => [
    { id: 'webhook', label: 'Webhook', icon: '🌐', color: '#8b5cf6' },
    { id: 'ai', label: 'AI', icon: '🤖', color: '#10b981' },
    { id: 'database', label: 'Database', icon: '💾', color: '#3b82f6' },
    { id: 'trigger', label: 'Trigger', icon: '⚡', color: '#ef4444' },
    { id: 'if', label: 'If', icon: '❓', color: '#f59e0b' },
    { id: 'gmail', label: 'Gmail', icon: '📧', color: '#ea4335' },
    { id: 'date', label: 'Date', icon: '⏰', color: '#6366f1' },
    { id: 'openai', label: 'OpenAI', icon: '🧠', color: '#00a67e' },
    { id: 'sheets', label: 'Sheets', icon: '📊', color: '#0f9d58' },
    { id: 'twilio', label: 'Twilio', icon: '💬', color: '#f22f46' },
    { id: 'calendar', label: 'Calendar', icon: '📅', color: '#4285f4' },
    // Additional nodes to demonstrate scrolling
    { id: 'slack', label: 'Slack', icon: '💬', color: '#4A154B' },
    { id: 'notion', label: 'Notion', icon: '📝', color: '#000000' },
    { id: 'dropbox', label: 'Dropbox', icon: '📦', color: '#0061FF' },
    { id: 'zapier', label: 'Zapier', icon: '⚡', color: '#FF4A00' },
    { id: 'github', label: 'GitHub', icon: '🐙', color: '#181717' },
    { id: 'trello', label: 'Trello', icon: '📋', color: '#0079BF' },
    { id: 'airtable', label: 'Airtable', icon: '🗃️', color: '#18BFFF' },
    { id: 'discord', label: 'Discord', icon: '🎮', color: '#5865F2' },
    { id: 'spotify', label: 'Spotify', icon: '🎵', color: '#1DB954' },
    { id: 'youtube', label: 'YouTube', icon: '📺', color: '#FF0000' },
    { id: 'twitter', label: 'Twitter', icon: '🐦', color: '#1DA1F2' },
    { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0A66C2' },
    { id: 'instagram', label: 'Instagram', icon: '📸', color: '#E4405F' },
    { id: 'whatsapp', label: 'WhatsApp', icon: '📱', color: '#25D366' }
  ], []);

  // Optimized drag start handler
  const handleNodeDragStart = useCallback((nodeId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedNode(nodeId);
    // Calculate position for dragging FROM the right sidebar TO the left (canvas)
    const nodeRect = e.currentTarget.getBoundingClientRect();
    // Place the node to the left of the sidebar, in the canvas area
    const canvasX = nodeRect.left - 200; // Move significantly left into canvas
    const canvasY = nodeRect.top - 100; // Account for any header offset
    onStartDragNewNode(nodeId, { 
      x: Math.max(50, canvasX), 
      y: Math.max(100, canvasY) 
    });
    // Reset drag state after a short delay
    setTimeout(() => setDraggedNode(null), 100);
  }, [onStartDragNewNode]);

  // Memoized styles for better performance
  const styles = useMemo(() => ({
    container: {
      position: 'fixed',
      right: 0,
      top: 0,
      width: isCollapsed ? '60px' : '280px',
      height: '100vh',
      backgroundColor: '#1a1a23',
      color: '#e1e1e1',
      borderLeft: '1px solid #2a2a35',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    header: {
      padding: isCollapsed ? '10px 5px' : '20px 20px 10px 20px',
      borderBottom: '1px solid #2a2a35',
      backgroundColor: '#1a1a23',
      flexShrink: 0, // Prevent header from shrinking
      zIndex: 10
    },
    toggleButton: {
      width: '100%',
      padding: isCollapsed ? '12px 8px' : '12px 16px',
      cursor: 'pointer',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#4f46e5',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.2s ease',
      boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    scrollableContent: {
      flex: 1, // Take remaining space
      padding: isCollapsed ? '10px 5px' : '20px',
      paddingTop: '10px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0 // Important for flex scrolling
    },
    nodesScrollContainer: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      minHeight: 0,
      paddingRight: '4px', // Space for scrollbar
      scrollbarWidth: 'thin',
      scrollbarColor: '#4a5568 #1a1a23'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#f8fafc',
      marginBottom: '16px',
      letterSpacing: '0.3px',
      opacity: isCollapsed ? 0 : 1,
      transition: 'opacity 0.3s ease'
    },
    nodeGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      paddingBottom: '20px' // Extra padding at bottom for better scrolling
    },
    collapsedNodeGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      alignItems: 'center',
      paddingBottom: '20px'
    },
    helpSection: {
      marginTop: '16px',
      padding: '16px',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(79, 70, 229, 0.2)',
      fontSize: '12px',
      color: '#a0a0b0',
      lineHeight: '1.5',
      flexShrink: 0 // Prevent from shrinking
    }
  }), [isCollapsed]);

 // Custom scrollbar CSS for sidebar   
const scrollbarCSS = `     
  .sidebar-scroll {       
    scrollbar-width: thin;       
    scrollbar-color: #4a5568 #1a1a23;
    padding-bottom: 300px !important; /* Add extra padding at bottom */
  }          
  
  .sidebar-scroll::-webkit-scrollbar {       
    width: 6px;       
    background: #1a1a23;     
  }          
  
  .sidebar-scroll::-webkit-scrollbar-track {       
    background: #1a1a23;       
    border-radius: 3px;     
  }          
  
  .sidebar-scroll::-webkit-scrollbar-thumb {       
    background-color: #4a5568;       
    border-radius: 3px;       
    border: 1px solid #1a1a23;       
    transition: background-color 0.2s ease;
  }          
  
  .sidebar-scroll::-webkit-scrollbar-thumb:hover {       
    background-color: #6b7280;     
  }          
  
  .sidebar-scroll::-webkit-scrollbar-corner {       
    background: #1a1a23;     
  }
`;
  // Memoized node item component
  const NodeItem = React.memo(({ node, isCollapsed, isDragged, isHovered }) => {
    const nodeStyle = {
      padding: isCollapsed ? '10px 8px' : '14px 16px',
      backgroundColor: isDragged ? '#3a3a4a' : (isHovered ? '#2a2a35' : '#242430'),
      borderRadius: '8px',
      cursor: 'grab',
      userSelect: 'none',
      textAlign: isCollapsed ? 'center' : 'left',
      border: `1px solid ${isDragged ? node.color : (isHovered ? '#3a3a4a' : '#2a2a35')}`,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isDragged ? 'scale(0.95) rotate(2deg)' : (isHovered ? 'translateY(-2px) scale(1.02)' : 'none'),
      boxShadow: isDragged 
        ? `0 8px 25px ${node.color}40` 
        : (isHovered ? `0 8px 20px rgba(0, 0, 0, 0.3)` : '0 2px 8px rgba(0, 0, 0, 0.2)'),
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      gap: isCollapsed ? '0' : '12px',
      flexDirection: isCollapsed ? 'column' : 'row',
      minHeight: isCollapsed ? '44px' : '52px'
    };

    return (
      <div
        style={nodeStyle}
        onMouseDown={(e) => handleNodeDragStart(node.id, e)}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        {/* Color accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: node.color,
            opacity: isDragged || isHovered ? 1 : 0.7,
            transition: 'opacity 0.2s ease'
          }}
        />
        {/* Icon */}
        <span
          style={{
            fontSize: isCollapsed ? '18px' : '20px',
            display: 'block',
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
            marginBottom: isCollapsed ? '2px' : '0'
          }}
        >
          {node.icon}
        </span>
        {/* Label */}
        {!isCollapsed && (
          <div
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#f8fafc',
              letterSpacing: '0.2px',
              lineHeight: '1.4',
              flex: 1
            }}
          >
            {node.label}
          </div>
        )}
        {/* Drag indicator */}
        {!isCollapsed && (
          <div
            style={{
              fontSize: '12px',
              color: '#6b7280',
              opacity: isHovered ? 1 : 0.5,
              transition: 'opacity 0.2s ease'
            }}
          >
            ⋮⋮
          </div>
        )}
      </div>
    );
  });

  return (
    <>
      {/* Inject custom scrollbar CSS */}
      <style>{scrollbarCSS}</style>
      
      <div style={styles.container} data-sidebar>
        {/* Fixed Header */}
        <div style={styles.header}>
          <button
            onClick={onToggleCollapse}
            style={styles.toggleButton}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#6366f1';
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#4f46e5';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 8px rgba(79, 70, 229, 0.3)';
            }}
          >
            {isCollapsed ? (
              <>
                <span style={{ fontSize: '16px' }}>→</span>
              </>
            ) : (
              <>
                <span>←</span>
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={styles.scrollableContent}>
          {!isCollapsed && (
            <h3 style={styles.sectionTitle}>
              Add Nodes
            </h3>
          )}
          
          {/* Nodes container with its own scroll */}
          <div style={styles.nodesScrollContainer} className="nodes-scroll">
            <div style={isCollapsed ? styles.collapsedNodeGrid : styles.nodeGrid}>
              {nodeTypes.map(node => (
                <NodeItem
                  key={node.id}
                  node={node}
                  isCollapsed={isCollapsed}
                  isDragged={draggedNode === node.id}
                  isHovered={hoveredNode === node.id}
                />
              ))}
            </div>
          </div>

          {/* Help text when expanded - outside scroll area */}
          {!isCollapsed && (
            <div style={styles.helpSection}>
              <div style={{ marginBottom: '8px', fontWeight: '600', color: '#e1e1e1' }}>
                💡 Quick Tips
              </div>
              <div>• Drag nodes left to canvas</div>
              <div>• Double-click nodes to connect</div>
              <div>• Click nodes to configure</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RightSidebar;