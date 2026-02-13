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
            <div className="activity-top">
                <div className="logo-container">
                    {/* <Icon name="leaf" size={24} color="" />  */}
                    <Icon name="leaf" size={24} color="green" />
                    {/* Icon should be green */}
                </div>
                {icons.map(item => (
                    <div
                        key={item.id}
                        className={`activity-icon ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => onViewChange(item.id)}
                        title={item.label}
                    >
                        <Icon name={item.icon} size={20} />
                    </div>
                ))}
            </div>
            <div className="activity-bottom">
                <div className="activity-icon" title="Settings" onClick={onSettingsClick}>
                    <Icon name="settings" size={20} />
                </div>
            </div>
        </div>
    );
};
