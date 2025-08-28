import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ActionButtons from './ActionButtons';
import RightSidebar from './RightSidebar';

const WorkflowEditor = ({ isExecuting, onNodeStatusChange, showProjectBuilder, projectData, onSave }) => {
  // Start with empty nodes array
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start collapsed
  const [openPanel1, setOpenPanel1] = useState(false);
  const [showNodeMenu, setShowNodeMenu] = useState(false);
  const animationFrameRef = useRef(null);

  const nodeTypeIcons = useMemo(() => ({
    webhook: '🌐',
    ai: '🤖',
    database: '💾',
    trigger: '⚡',
    gmail: '📧',
    schedule: '⏰',
    http: '📡',
    email: '✉️',
    'ai-template': '📝',
    'ai-agent': '🤖',
    openai: '🧠',
    slack: '💬',
    notion: '📝',
    if: '❓',
    date: '📅'
  }), []);

  // Available nodes for selection
  const availableNodes = [
    { id: 'webhook', name: 'Webhook Trigger', icon: '🌐', color: '#4F46E5' },
    { id: 'ai', name: 'AI Processing', icon: '🤖', color: '#7C3AED' },
    { id: 'database', name: 'Database', icon: '💾', color: '#059669' },
    { id: 'email', name: 'Email Action', icon: '📧', color: '#DC2626' },
    { id: 'http', name: 'HTTP Request', icon: '📡', color: '#EA580C' },
    { id: 'schedule', name: 'Schedule', icon: '⏰', color: '#0891B2' }
  ];

  const handleAddNode = useCallback((type, position) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) + ' Node' }
    };
    setNodes(prev => [...prev, newNode]);
  }, []);

  const handleStartDragNewNode = useCallback((nodeType) => {
    handleAddNode(nodeType, { x: 300, y: 200 });
  }, [handleAddNode]);

  const handleNodeMouseDown = useCallback((nodeId, e) => {
    e.preventDefault();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    setDraggingNode(nodeId);
    setDragOffset({ x: e.clientX - node.position.x, y: e.clientY - node.position.y });
  }, [nodes]);

  // Handle central box click
  const handleCentralBoxClick = () => {
    setShowNodeMenu(true);
  };

  // Handle node selection from menu
  const handleNodeSelect = (nodeType) => {
    // Add node to center of canvas
    const canvasRect = document.querySelector('[data-canvas]')?.getBoundingClientRect();
    const centerX = canvasRect ? canvasRect.width / 2 - 70 : 400; // 70 = half node width
    const centerY = canvasRect ? canvasRect.height / 2 - 28 : 300; // 28 = half node height
    
    handleAddNode(nodeType.id, { x: centerX, y: centerY });
    setShowNodeMenu(false);
  };

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
        <path d={pathData} stroke="#4f46e5" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx={endX} cy={endY} r="4" fill="#4f46e5" />
      </g>
    );
  }, [nodes]);

  useEffect(() => {
    if (!draggingNode) return;

    const handleGlobalMouseMove = (e) => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(() => {
        setNodes(prevNodes =>
          prevNodes.map(node =>
            node.id === draggingNode
              ? { ...node, position: { x: Math.max(0, e.clientX - dragOffset.x), y: Math.max(80, e.clientY - dragOffset.y) } }
              : node
          )
        );
      });
    };

    const handleGlobalMouseUp = () => {
      setDraggingNode(null);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [draggingNode, dragOffset]);

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
      overflow: 'hidden' 
    },
    nodesContainer: { 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      padding: '80px 20px 20px 20px',
      backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
      backgroundSize: '50px 50px'
    }
  }), [draggingNode]);

  return (
    <div style={styles.container}>
      <div style={styles.workflowCanvas} data-canvas>
        <div style={styles.nodesContainer}>
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            {edges.map(edge => renderConnection(edge.source, edge.target))}
          </svg>

          {/* Central "Add first step" box - only show when no nodes */}
          {nodes.length === 0 && !showNodeMenu && (
            <div
              onClick={handleCentralBoxClick}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px dashed rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontSize: '18px',
                fontWeight: '500',
                textAlign: 'center',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                e.target.style.transform = 'translate(-50%, -50%) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translate(-50%, -50%) scale(1)';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>+</div>
              <div>Add first step...</div>
            </div>
          )}

          {/* Node selection menu */}
          {showNodeMenu && (
            <>
              {/* Backdrop */}
              <div 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 20
                }}
                onClick={() => setShowNodeMenu(false)}
              />
              
              {/* Menu */}
              <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(30, 27, 75, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 30,
                minWidth: '400px'
              }}>
                <h3 style={{
                  color: 'white',
                  marginBottom: '20px',
                  fontSize: '20px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  Choose a node type
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px'
                }}>
                  {availableNodes.map((node) => (
                    <div
                      key={node.id}
                      onClick={() => handleNodeSelect(node)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        color: 'white',
                        textAlign: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = node.color + '40';
                        e.target.style.borderColor = node.color;
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{node.icon}</div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{node.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Existing nodes */}
          {nodes.map(node => (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: node.position.x,
                top: node.position.y,
                width: 140,
                height: 56,
                padding: '16px 20px',
                backgroundColor: '#2a2a35',
                borderRadius: '12px',
                border: '2px solid #3a3a4a',
                cursor: draggingNode === node.id ? 'grabbing' : 'grab',
                textAlign: 'center',
                zIndex: 2,
                userSelect: 'none'
              }}
              onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
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

      <RightSidebar
        onAddNode={handleAddNode}
        onStartDragNewNode={handleStartDragNewNode}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        openPanel1Trigger={openPanel1}
      />

      <ActionButtons
        onOpenNodesPanel={() => setOpenPanel1(true)}
        onCopy={() => {}}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        onToggleAI={() => {}}
        isSidebarCollapsed={isSidebarCollapsed}
      />
    </div>
  );
};

export default WorkflowEditor;