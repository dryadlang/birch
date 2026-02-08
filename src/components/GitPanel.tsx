import React from 'react';
import { Icon } from './Icon';
import '../App.css';

interface GitChange {
    path: string;
    status: 'modified' | 'added' | 'deleted' | 'untracked';
}

interface GitPanelProps {
    isVisible: boolean;
    branch: string;
    changes: GitChange[];
    onStageAll: () => void;
    onCommit: (message: string) => void;
    onFileClick: (path: string) => void;
}

export const GitPanel: React.FC<GitPanelProps> = ({
    isVisible,
    branch,
    changes,
    onStageAll,
    onCommit,
    onFileClick,
}) => {
    const [commitMessage, setCommitMessage] = React.useState('');

    if (!isVisible) return null;

    const statusIcons: Record<GitChange['status'], { icon: string; color: string }> = {
        modified: { icon: 'file-diff', color: '#e2b93d' },
        added: { icon: 'file-plus', color: '#73c991' },
        deleted: { icon: 'file-minus', color: '#f14c4c' },
        untracked: { icon: 'file-question', color: '#858585' },
    };

    const stagedChanges = changes.filter(c => c.status === 'added');
    const unstagedChanges = changes.filter(c => c.status !== 'added');

    return (
        <aside className="git-panel sidebar">
            <div className="sidebar-header">
                <Icon name="git-branch" size={14} />
                <span>SOURCE CONTROL</span>
            </div>

            <div className="git-branch-info">
                <Icon name="git-branch" size={14} />
                <span>{branch || 'main'}</span>
            </div>

            <div className="git-commit-section">
                <input
                    type="text"
                    placeholder="Commit message..."
                    value={commitMessage}
                    onChange={e => setCommitMessage(e.target.value)}
                    className="git-commit-input"
                />
                <div className="git-commit-actions">
                    <button
                        className="git-btn commit"
                        onClick={() => {
                            if (commitMessage.trim()) {
                                onCommit(commitMessage);
                                setCommitMessage('');
                            }
                        }}
                        disabled={!commitMessage.trim()}
                    >
                        <Icon name="check" size={14} /> Commit
                    </button>
                </div>
            </div>

            <div className="git-changes-section">
                {stagedChanges.length > 0 && (
                    <>
                        <div className="git-section-header">
                            <span>Staged Changes</span>
                            <span className="count">{stagedChanges.length}</span>
                        </div>
                        {stagedChanges.map(change => (
                            <div
                                key={change.path}
                                className="git-change-item"
                                onClick={() => onFileClick(change.path)}
                            >
                                <Icon
                                    name={statusIcons[change.status].icon}
                                    size={14}
                                />
                                <span className="git-change-path">{change.path.split('/').pop()}</span>
                                <span
                                    className="git-change-status"
                                    style={{ color: statusIcons[change.status].color }}
                                >
                                    {change.status[0].toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </>
                )}

                <div className="git-section-header">
                    <span>Changes</span>
                    <span className="count">{unstagedChanges.length}</span>
                    {unstagedChanges.length > 0 && (
                        <button className="git-btn-small" onClick={onStageAll} title="Stage All">
                            <Icon name="plus" size={12} />
                        </button>
                    )}
                </div>

                {unstagedChanges.length === 0 ? (
                    <div className="git-empty">No changes</div>
                ) : (
                    unstagedChanges.map(change => (
                        <div
                            key={change.path}
                            className="git-change-item"
                            onClick={() => onFileClick(change.path)}
                        >
                            <Icon
                                name={statusIcons[change.status].icon}
                                size={14}
                            />
                            <span className="git-change-path">{change.path.split('/').pop()}</span>
                            <span
                                className="git-change-status"
                                style={{ color: statusIcons[change.status].color }}
                            >
                                {change.status[0].toUpperCase()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </aside>
    );
};
