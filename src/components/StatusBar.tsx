import React from 'react';
import { Icon } from './Icon';
import '../App.css';

interface StatusBarProps {
    activeFile: string | null;
    lineNumber: number;
    columnNumber: number;
    isDirty: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
    activeFile,
    lineNumber,
    columnNumber,
    isDirty,
}) => {
    return (
        <footer className="status-bar">
            <div className="status-item" title="Git Branch">
                <Icon name="git-branch" size={14} color="var(--accent-secondary)" />
                <span>main</span>
            </div>
            <div className="status-spacer" />
            <div className="status-item" title="File Status">
                {isDirty && <div className="dirty-dot" style={{ width: 6, height: 6, background: 'var(--accent-primary)' }} />}
                <span>{activeFile?.split(/[/\\]/).pop() || 'No file selected'}</span>
            </div>
            <div className="status-spacer" />
            <div className="status-item" title="Cursor Position">
                Ln {lineNumber}, Col {columnNumber}
            </div>
            <div className="status-spacer" />
            <div className="status-item">
                <Icon name="leaf" size={14} color="var(--accent-success)" />
                <span>Dryad Ready</span>
            </div>
            <div className="status-spacer" />
            <div className="status-item">
                <Icon name="bell" size={14} />
            </div>
        </footer>
    );
};
