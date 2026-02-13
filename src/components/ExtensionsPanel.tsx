import React, { useState } from 'react';
import { Icon } from './Icon';
import '../App.css';

interface Extension {
    id: string;
    name: string;
    description: string;
    version: string;
    author: string;
    installed: boolean;
    icon: string;
}

const mockExtensions: Extension[] = [
    { id: 'dryad-lsp', name: 'Dryad Language Support', description: 'Advanced IntelliSense and refactoring for Dryad.', version: '1.2.0', author: 'Birch Team', installed: true, icon: 'leaf' },
    { id: 'theme-nebula', name: 'Nebula Theme', description: 'A vibrant, glass-morphic theme for late-night coding.', version: '0.8.5', author: 'Community', installed: false, icon: 'palette' },
    { id: 'git-lens', name: 'Git Timeline', description: 'Visualize file history and blame information.', version: '2.0.1', author: 'Birch Team', installed: false, icon: 'history' },
];

export const ExtensionsPanel: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="extensions-panel" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="extensions-header" style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Extensions</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Discover and install plugins to enhance your experience.</p>
            </div>

            <div className="extensions-search" style={{ position: 'relative', marginBottom: '24px' }}>
                <input
                    type="text"
                    placeholder="Search extensions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 16px 12px 44px',
                        background: 'var(--bg-tab)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                    }}
                />
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Icon name="search" size={18} />
                </div>
            </div>

            <div className="extensions-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                {mockExtensions.map(ext => (
                    <div
                        key={ext.id}
                        className="extension-card"
                        style={{
                            background: 'var(--bg-sidebar)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '16px',
                            display: 'flex',
                            gap: '16px',
                            transition: 'transform 0.2s',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Icon name={ext.icon as any} size={28} color="var(--accent-primary)" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: '600' }}>{ext.name}</h3>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>v{ext.version}</span>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>{ext.description}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>By {ext.author}</span>
                                <button style={{
                                    padding: '4px 12px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: ext.installed ? 'rgba(16, 185, 129, 0.1)' : 'var(--accent-primary)',
                                    color: ext.installed ? 'var(--accent-success)' : 'white',
                                    border: 'none',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}>
                                    {ext.installed ? 'Installed' : 'Install'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
