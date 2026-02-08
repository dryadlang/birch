import React from 'react';
import { Icon } from './Icon';
import '../App.css';

interface ActivityBarProps {
    activeView: string;
    onViewChange: (view: string) => void;
    onSettingsClick: () => void;
}

const icons = [
    { id: 'explorer', icon: 'files', label: 'Explorer' },
    { id: 'search', icon: 'search', label: 'Search' },
    { id: 'git', icon: 'git-branch', label: 'Source Control' },
    { id: 'debug', icon: 'bug', label: 'Run and Debug' },
    { id: 'extensions', icon: 'puzzle', label: 'Extensions' },
];

export const ActivityBar: React.FC<ActivityBarProps> = ({ activeView, onViewChange, onSettingsClick }) => {
    return (
        <div className="activity-bar">
            {icons.map(item => (
                <div
                    key={item.id}
                    className={`activity-icon ${activeView === item.id ? 'active' : ''}`}
                    onClick={() => onViewChange(item.id)}
                    title={item.label}
                >
                    <Icon name={item.icon} size={24} />
                </div>
            ))}
            <div className="activity-spacer" />
            <div className="activity-icon" title="Settings" onClick={onSettingsClick}>
                <Icon name="settings" size={24} />
            </div>
        </div>
    );
};
