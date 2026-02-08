import React from 'react';
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
            <div className="status-item">
                {isDirty && <span>●</span>}
                {activeFile || 'No file'}
            </div>
            <div className="status-spacer" />
            <div className="status-item">Ln {lineNumber}, Col {columnNumber}</div>
            <div className="status-item">UTF-8</div>
            <div className="status-item">Dryad</div>
        </footer>
    );
};
