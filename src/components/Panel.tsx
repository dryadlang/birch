import React, { useState } from 'react';
import { ResizeHandle } from './ResizeHandle';
import { Icon } from './Icon';
import '../App.css';

interface PanelProps {
    isVisible: boolean;
    onToggle: () => void;
    height: number;
    onHeightChange: (height: number) => void;
}

const panelTabs = ['TERMINAL', 'OUTPUT', 'PROBLEMS', 'DEBUG CONSOLE'];

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 500;

export const Panel: React.FC<PanelProps> = ({ isVisible, onToggle, height, onHeightChange }) => {
    const [activeTab, setActiveTab] = useState('TERMINAL');

    if (!isVisible) return null;

    const handleResize = (delta: number) => {
        const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, height - delta));
        onHeightChange(newHeight);
    };

    return (
        <div className="panel" style={{ height: `${height}px` }}>
            <ResizeHandle direction="vertical" onResize={handleResize} />
            <div className="panel-header">
                <div className="panel-tabs">
                    {panelTabs.map(tab => (
                        <button
                            key={tab}
                            className={`panel-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <button className="panel-close-btn" onClick={onToggle} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <Icon name="x" size={18} />
                </button>
            </div>
            <div className="panel-content" style={{ flex: 1, padding: '12px 20px', overflowY: 'auto' }}>
                {activeTab === 'TERMINAL' && (
                    <div className="terminal-placeholder" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>birch@ide</span>:<span style={{ color: '#818cf8' }}>~/projects/dryad</span>$ Terminal ready
                    </div>
                )}
                {/* ... rest of the tabs ... */}
            </div>
        </div>
    );
};
