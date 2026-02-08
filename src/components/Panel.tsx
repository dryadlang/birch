import React, { useState } from 'react';
import { ResizeHandle } from './ResizeHandle';
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
                <button className="panel-close" onClick={onToggle}>×</button>
            </div>
            <div className="panel-content">
                {activeTab === 'TERMINAL' && (
                    <div className="terminal-placeholder">
                        <span style={{ color: 'var(--accent-secondary)' }}>$</span> Terminal coming soon...
                    </div>
                )}
                {activeTab === 'OUTPUT' && (
                    <div className="output-placeholder">No output</div>
                )}
                {activeTab === 'PROBLEMS' && (
                    <div className="problems-placeholder">No problems detected</div>
                )}
                {activeTab === 'DEBUG CONSOLE' && (
                    <div className="debug-console-placeholder">Debug console ready...</div>
                )}
            </div>
        </div>
    );
};
