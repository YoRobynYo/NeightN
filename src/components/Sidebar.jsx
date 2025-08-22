import React from 'react';
import { 
  Home, 
  User, 
  Youtube, 
  Settings, 
  FileText, 
  BarChart3, 
  HelpCircle,
  Workflow
} from 'lucide-react';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const navSections = [
    {
      title: 'Main',
      items: [
        { id: 'overview', label: 'Overview', icon: Home },
      ]
    },
    {
      title: 'Projects',
      items: [
        { id: 'personal', label: 'Personal', icon: User },
        { id: 'youtube-tutorials', label: 'YouTube Tutorials', icon: Youtube },
      ]
    },
    {
      title: 'Tools',
      items: [
        { id: 'admin-panel', label: 'Admin Panel', icon: Settings },
        { id: 'templates', label: 'Templates', icon: FileText },
        { id: 'variables', label: 'Variables', icon: BarChart3 },
        { id: 'insights', label: 'Insights', icon: BarChart3 },
        { id: 'help', label: 'Help', icon: HelpCircle },
      ]
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <Workflow size={20} />
          </div>
          <span className="logo-text">neightn</span>
        </div>
      </div>
      
      <div className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.title} className="nav-section">
            <div className="nav-title">{section.title}</div>
            <ul className="nav-items">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="nav-item">
                    <div
                      className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                      onClick={() => onSectionChange(item.id)}
                    >
                      <Icon className="nav-icon" size={20} />
                      <span>{item.label}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;