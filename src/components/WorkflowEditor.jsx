// WorkflowEditor.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ActionButtons from './ActionButtons';
import RightSidebar from './RightSidebar';

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

  // Add a node from the sidebar at a given position
  const handleAddNode = useCallback((type, position) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) + ' Node' }
    };
    setNodes(prev => [...prev, newNode]);
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

  // Node dragging effect
  useEffect(() => {
    if (!draggingNode) return;

    const handleGlobalMouseMove = (e) => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

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

  const styles = useMemo(() => ({
    container: { display: 'flex', height: '100vh', backgroundColor: '#0f0f13', color: '#e1e1e1', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
    workflowCanvas: { flex: 1, position: 'relative', cursor: draggingNode ? 'grabbing' : 'default', overflow: 'hidden' },
    nodesContainer: { position: 'relative', width: '100%', height: '100%', padding: '80px 20px 20px 20px' }
  }), [draggingNode]);

  return (
    <div style={styles.container}>
      <div style={styles.workflowCanvas} onClick={() => setIsConnecting(false)}>
        <div style={styles.nodesContainer}>
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
            {edges.map(edge => renderConnection(edge.source, edge.target))}
          </svg>
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

      <RightSidebar
        onAddNode={handleAddNode}
        onStartDragNewNode={handleAddNode}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      <ActionButtons
        onOpenNodesPanel={() => {}}
        onCopy={() => {}}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        onToggleAI={() => {}}
        isSidebarCollapsed={isSidebarCollapsed}
      />
    </div>
  );
};

export default WorkflowEditor;
