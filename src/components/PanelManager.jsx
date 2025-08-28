import React, { useState } from 'react';

const PanelManager = ({ openPanelIndex = 0, isSidebarCollapsed }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const panels = [
    // Panel 1: your existing content
    <div key={0} style={{ padding: '20px', color: '#e1e1e1' }}>
      <h3 style={{ margin: '0 0 20px 0' }}>What happens next?</h3>
      <input
        type="text"
        placeholder="Search nodes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#2a2a35',
          border: '1px solid #3a3a4a',
          borderRadius: '6px',
          color: '#fff',
        }}
      />

      {/* AI Section */}
      <div style={{ marginBottom: '30px', cursor: 'pointer' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>AI</h4>
        <p style={{ fontSize: '14px', color: '#a1a1aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Build autonomous agents, summarize or search documents, etc.
          <span style={{ fontSize: '16px', marginLeft: '12px', flexShrink: 0 }}>→</span>
        </p>
      </div>

      {/* Action in an app Section */}
      <div style={{ marginBottom: '30px', cursor: 'pointer' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Action in an app</h4>
        <p style={{ fontSize: '14px', color: '#a1a1aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Do something in an app or service like Google Sheets, Telegram or Notion
          <span style={{ fontSize: '16px', marginLeft: '12px', flexShrink: 0 }}>→</span>
        </p>
      </div>

      {/* Data transformation Section */}
      <div style={{ marginBottom: '30px', cursor: 'pointer' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Data transformation</h4>
        <p style={{ fontSize: '14px', color: '#a1a1aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Manipulate, filter or convert data
          <span style={{ fontSize: '16px', marginLeft: '12px', flexShrink: 0 }}>→</span>
        </p>
      </div>

      {/* Flow Section */}
      <div style={{ marginBottom: '30px', cursor: 'pointer' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Flow</h4>
        <p style={{ fontSize: '14px', color: '#a1a1aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Branch, merge or loop the flow, etc.
          <span style={{ fontSize: '16px', marginLeft: '12px', flexShrink: 0 }}>→</span>
        </p>
      </div>

      {/* Core Section */}
      <div style={{ marginBottom: '30px', cursor: 'pointer' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Core</h4>
        <p style={{ fontSize: '14px', color: '#a1a1aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Run code, make HTTP requests, set webhooks, etc.
          <span style={{ fontSize: '16px', marginLeft: '12px', flexShrink: 0 }}>→</span>
        </p>
      </div>

      {/* Human in the loop Section */}
      <div style={{ marginBottom: '30px', cursor: 'pointer' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Human in the loop</h4>
        <p style={{ fontSize: '14px', color: '#a1a1aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Wait for approval or human input before continuing
          <span style={{ fontSize: '16px', marginLeft: '12px', flexShrink: 0 }}>→</span>
        </p>
      </div>

      {/* Add another trigger Section */}
      <div style={{ marginBottom: '30px', cursor: 'pointer' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Add another trigger</h4>
        <p style={{ fontSize: '14px', color: '#a1a1aa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Triggers start your workflow. Workflows can have multiple triggers.
          <span style={{ fontSize: '16px', marginLeft: '12px', flexShrink: 0 }}>→</span>
        </p>
      </div>
    </div>,

    // Panels 2–10: empty placeholders
    ...Array.from({ length: 9 }, (_, i) => <div key={i + 1} style={{ padding: '20px', color: '#e1e1e1' }}>Panel {i + 2}</div>),
  ];

  return (
    <div style={{ width: isSidebarCollapsed ? '0px' : '300px', overflow: 'hidden', transition: 'width 0.2s' }}>
      {panels[openPanelIndex]}
    </div>
  );
};

export default PanelManager;