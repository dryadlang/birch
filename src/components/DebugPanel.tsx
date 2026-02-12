import React, { useState } from 'react';
import { Icon } from './Icon';
import BreakpointsPanel from './debug/BreakpointsPanel';
import VariablesPanel from './debug/VariablesPanel';
import CallStackPanel from './debug/CallStackPanel';
import { ProcessPanel } from './debug/ProcessPanel';
import '../App.css';

export const DebugPanel: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>('variables');

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="debug-panel">
            <div className="debug-toolbar-main">
                <div className="debug-controls">
                    <button className="debug-control-btn success" title="Continue (F5)">
                        <Icon name="player-play" size={16} />
                    </button>
                    <button className="debug-control-btn" title="Step Over (F10)">
                        <Icon name="arrow-autofit-right" size={16} />
                    </button>
                    <button className="debug-control-btn" title="Step Into (F11)">
                        <Icon name="arrow-autofit-down" size={16} />
                    </button>
                    <button className="debug-control-btn" title="Step Out (Shift+F11)">
                        <Icon name="arrow-autofit-up" size={16} />
                    </button>
                    <div className="debug-separator" />
                    <button className="debug-control-btn warning" title="Restart (Ctrl+Shift+F5)">
                        <Icon name="rotate-clockwise" size={16} />
                    </button>
                    <button className="debug-control-btn danger" title="Stop (Shift+F5)">
                        <Icon name="player-stop" size={16} />
                    </button>
                </div>
            </div>

            <div className="debug-sidebar">
                <div className="debug-foldable">
                    <div className="debug-foldable-header" onClick={() => toggleSection('variables')}>
                        <Icon name={activeSection === 'variables' ? 'chevron-down' : 'chevron-right'} size={14} />
                        <span>VARIABLES</span>
                    </div>
                    {activeSection === 'variables' && <VariablesPanel />}
                </div>

                <div className="debug-foldable">
                    <div className="debug-foldable-header" onClick={() => toggleSection('watch')}>
                        <Icon name={activeSection === 'watch' ? 'chevron-down' : 'chevron-right'} size={14} />
                        <span>WATCH</span>
                    </div>
                    {activeSection === 'watch' && (
                        <div className="debug-empty">No watch expressions</div>
                    )}
                </div>

                <div className="debug-foldable">
                    <div className="debug-foldable-header" onClick={() => toggleSection('callstack')}>
                        <Icon name={activeSection === 'callstack' ? 'chevron-down' : 'chevron-right'} size={14} />
                        <span>CALL STACK</span>
                    </div>
                    {activeSection === 'callstack' && <CallStackPanel />}
                </div>

                <div className="debug-foldable">
                    <div className="debug-foldable-header" onClick={() => toggleSection('breakpoints')}>
                        <Icon name={activeSection === 'breakpoints' ? 'chevron-down' : 'chevron-right'} size={14} />
                        <span>BREAKPOINTS</span>
                    </div>
                    {activeSection === 'breakpoints' && <BreakpointsPanel />}
                </div>

                <div className="debug-foldable">
                    <div className="debug-foldable-header" onClick={() => toggleSection('process')}>
                        <Icon name={activeSection === 'process' ? 'chevron-down' : 'chevron-right'} size={14} />
                        <span>PROCESS ANALYZER</span>
                    </div>
                    {activeSection === 'process' && <ProcessPanel />}
                </div>
            </div>
        </div>
    );
};
