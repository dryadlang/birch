import React from 'react';
import { Icon } from './Icon';
import '../App.css';

interface StartPageProps {
    onOpenFolder: () => void;
    onOpenFile: () => void;
    onCreateProject: () => void;
    recentProjects: Array<{ name: string; path: string; lastOpened: string }>;
}

export const StartPage: React.FC<StartPageProps> = ({
    onOpenFolder,
    onOpenFile,
    onCreateProject,
    recentProjects
}) => {
    return (
        <div className="start-page">
            <div className="start-page-logo">
                <span style={{ fontSize: 80 }}>🌿</span>
            </div>
            <h1 className="start-page-title">Birch IDE</h1>

            <div className="start-page-actions">
                <button className="start-page-btn" onClick={onCreateProject}>
                    <span className="start-page-btn-icon"><Icon name="plus" size={20} /></span>
                    Create Dryad Project
                </button>
                <button className="start-page-btn" onClick={onOpenFolder}>
                    <span className="start-page-btn-icon"><Icon name="folder-open" size={20} /></span>
                    Open Folder
                </button>
                <button className="start-page-btn" onClick={onOpenFile}>
                    <span className="start-page-btn-icon"><Icon name="file" size={20} /></span>
                    Open File
                </button>
            </div>

            <div className="start-page-section">
                <h3 className="start-page-section-title">Recent</h3>
                <div className="recent-projects">
                    {recentProjects.length > 0 ? (
                        recentProjects.map((p, i) => (
                            <button key={i} className="recent-project" onClick={onOpenFolder}>
                                <Icon name="folder" size={16} style={{ color: 'var(--text-secondary)' }} />
                                <div>
                                    <div className="recent-project-name">{p.name}</div>
                                    <div className="recent-project-path">{p.path}</div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: 12 }}>
                            No recent projects
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
