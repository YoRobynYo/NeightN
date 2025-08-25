import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const WorkflowEditor = ({ isExecuting, onNodeStatusChange, showProjectBuilder, projectData, onSave }) => {
  const [nodes, setNodes] = useState([
    { id: '1', type: 'webhook', position: { x: 100, y: 100 }, data: { label: 'Webhook Trigger' } },
    { id: '2', type: 'ai', position: { x: 400, y: 100 }, data: { label: 'AI Processing' } },
    { id: '3', type: 'database', position: { x: 400, y: 300 }, data: { label: 'Database' } }
  ]);

  const [edges, setEdges] = useState([
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' }
  ]);

  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const animationFrameRef = useRef(null);

  const nodeTypeIcons = useMemo(() => ({
    webhook: '🌐',
    ai: '🤖', 
    database: '💾',
    trigger: '⚡',
    gmail: '📧',
    schedule: '⏰',
    http: '📡',
    email: '✉️'
  }), []);

  // Custom scrollbar CSS for sidebar
  const scrollbarCSS = `
    .sidebar-scroll {
      scrollbar-width: thin;
      scrollbar-color: #4a5568 #1a1a23;
    }
    
    .sidebar-scroll::-webkit-scrollbar {
      width: 12px;
      background: #1a1a23;
    }
    
    .sidebar-scroll::-webkit-scrollbar-track {
      background: #1a1a23;
      border-radius: 6px;
    }
    
    .sidebar-scroll::-webkit-scrollbar-thumb {
      background-color: #4a5568;
      border-radius: 6px;
      border: 2px solid #1a1a23;
      transition: background-color 0.2s ease;
    }
    
    .sidebar-scroll::-webkit-scrollbar-thumb:hover {
      background-color: #6b7280;
    }
    
    .sidebar-scroll::-webkit-scrollbar-corner {
      background: #1a1a23;
    }
  `;

  // Node dragging effect
  useEffect(() => {
    if (!draggingNode) return;

    const handleGlobalMouseMove = (e) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        setNodes(prevNodes => 
          prevNodes.map(node => 
            node.id === draggingNode 
              ? {
                  ...node,
                  position: {
                    x: Math.max(0, e.clientX - dragOffset.x),
                    y: Math.max(80, e.clientY - dragOffset.y)
                  }
                }
              : node
          )
        );
      });
    };

    const handleGlobalMouseUp = () => {
      setDraggingNode(null);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [draggingNode, dragOffset]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isConnecting) {
        setIsConnecting(false);
        setConnectionStart(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isConnecting]);

  const handleStartDragNewNode = useCallback((type, startPos) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: startPos.x, y: startPos.y },
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) + ' Node' }
    };

    setNodes(prev => [...prev, newNode]);
    setDraggingNode(newNode.id);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleNodeMouseDown = useCallback((nodeId, e) => {
    e.preventDefault();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggingNode(nodeId);
    setDragOffset({ x: e.clientX - node.position.x, y: e.clientY - node.position.y });
  }, [nodes]);

  const handleNodeClick = useCallback((nodeId, e) => {
    e.stopPropagation();
    if (isConnecting && connectionStart && connectionStart !== nodeId) {
      const newEdge = {
        id: `e${connectionStart}-${nodeId}-${Date.now()}`,
        source: connectionStart,
        target: nodeId
      };
      setEdges(prev => [...prev, newEdge]);
      setIsConnecting(false);
      setConnectionStart(null);
    }
  }, [isConnecting, connectionStart]);

  const handleNodeDoubleClick = useCallback((nodeId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsConnecting(true);
    setConnectionStart(nodeId);
  }, []);

  const handleCanvasClick = useCallback((e) => {
    if (isConnecting && e.target === e.currentTarget) {
      setIsConnecting(false);
      setConnectionStart(null);
    }
  }, [isConnecting]);

  const renderConnection = useCallback((sourceId, targetId) => {
    const source = nodes.find(n => n.id === sourceId);
    const target = nodes.find(n => n.id === targetId);
    if (!source || !target) return null;

    const nodeWidth = 140;
    const nodeHeight = 56;
    const startX = source.position.x + nodeWidth / 2;
    const startY = source.position.y + nodeHeight / 2;
    const endX = target.position.x + nodeWidth / 2;
    const endY = target.position.y + nodeHeight / 2;
    const midX = startX + (endX - startX) * 0.5;
    const pathData = `M ${startX},${startY} C ${midX},${startY} ${midX},${endY} ${endX},${endY}`;

    return (
      <g key={`connection-${sourceId}-${targetId}`}>
        <path 
          d={pathData} 
          stroke="#4f46e5" 
          strokeWidth="3" 
          fill="none" 
          strokeLinecap="round"
        />
        <circle cx={endX} cy={endY} r="4" fill="#4f46e5" />
      </g>
    );
  }, [nodes]);

  const addNode = useCallback((type, position) => handleStartDragNewNode(type, position), [handleStartDragNewNode]);

  const styles = useMemo(() => ({
    container: { 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#0f0f13', 
      color: '#e1e1e1', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' 
    },
    workflowCanvas: { 
      flex: 1, 
      position: 'relative',
      cursor: draggingNode ? 'grabbing' : 'default',
      overflow: 'hidden' // Remove scroll from canvas
    },
    scrollableWorkspace: {
      // Large workspace area that can be scrolled
      minWidth: '2000px', // Much larger than viewport
      minHeight: '1500px', // Much larger than viewport
      width: '100%',
      height: '100%',
      position: 'relative'
    },
    nodesContainer: { 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      padding: '80px 20px 20px 20px' 
    },
    node: {
      position: 'absolute',
      padding: '16px 20px',
      backgroundColor: '#2a2a35',
      borderRadius: '12px',
      border: '2px solid #3a3a4a',
      cursor: 'grab',
      minWidth: '140px',
      textAlign: 'center',
      transition: draggingNode ? 'none' : 'all 0.2s ease',
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      zIndex: 2,
      userSelect: 'none'
    },
    sidebar: {
      width: isSidebarCollapsed ? '60px' : '280px', 
      backgroundColor: '#1a1a23', 
      borderLeft: '1px solid #2a2a35',
      transition: 'width 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      position: 'relative',
      zIndex: 10, // Ensure sidebar is above scrollbar
      // Add scrolling to the sidebar itself
      overflow: 'auto'
    },
    sidebarContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 120px)' // Account for button and padding
    }
  }), [draggingNode, isSidebarCollapsed]);

  return (
    <>
      {/* Inject custom scrollbar CSS */}
      <style>{scrollbarCSS}</style>
      
      <div style={styles.container}>
        <div style={styles.workflowCanvas} onClick={handleCanvasClick}>
          <div style={styles.nodesContainer}>
            <svg 
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                pointerEvents: 'none', 
                zIndex: 1 
              }}
            >
              {edges.map(edge => renderConnection(edge.source, edge.target))}
            </svg>

            {nodes.map(node => (
              <div
                key={node.id}
                style={{
                  ...styles.node,
                  left: node.position.x,
                  top: node.position.y,
                  cursor: draggingNode === node.id ? 'grabbing' : 'grab'
                }}
                onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                onClick={(e) => handleNodeClick(node.id, e)}
                onDoubleClick={(e) => handleNodeDoubleClick(node.id, e)}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                  {nodeTypeIcons[node.type] || '⚙️'}
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#e1e1e1' }}>
                  {node.data.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.sidebar} className="sidebar-scroll">
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{ 
              background: '#2a2a35', 
              border: 'none', 
              color: '#e1e1e1', 
              padding: '8px', 
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '20px',
              flexShrink: 0
            }}
          >
            {isSidebarCollapsed ? '→' : '←'}
          </button>

          <div style={styles.sidebarContent}>
            {!isSidebarCollapsed && (
              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#f8fafc' }}>Add Nodes</h3>
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  paddingBottom: '20px'
                }}>
                  {Object.keys(nodeTypeIcons).map(type => (
                    <button
                      key={type}
                      onClick={() => addNode(type, { x: 200, y: 200 })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        padding: '8px',
                        borderRadius: '24px',
                        backgroundColor: '#2a2a35',
                        border: '1px solid #3a3a4a',
                        color: '#e1e1e1',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontSize: '18px', marginRight: '6px' }}>
                        {nodeTypeIcons[type]}
                      </span>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                  
                  {/* Add many more buttons to force scrolling */}
                  {Array.from({ length: 20 }, (_, i) => (
                    <button
                      key={`extra-${i}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        padding: '8px',
                        borderRadius: '24px',
                        backgroundColor: '#2a2a35',
                        border: '1px solid #3a3a4a',
                        color: '#e1e1e1',
                        cursor: 'pointer',
                        fontSize: '12px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontSize: '18px', marginRight: '6px' }}>
                        🔧
                      </span>
                      Tool {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkflowEditor;