import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import '../App.css';

export interface OpenTab {
    path: string;
    name: string;
    isDirty: boolean;
}

interface TabContextMenuProps {
    x: number;
    y: number;
    tab: OpenTab;
    onClose: () => void;
    onCloseTab: (path: string) => void;
}

const TabContextMenu: React.FC<TabContextMenuProps> = ({
    x,
    y,
    tab,
    onClose,
    onCloseTab,
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div className="context-menu" ref={menuRef} style={{ left: x, top: y, position: 'fixed', zIndex: 1000, background: 'var(--bg-popup)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '4px', boxShadow: 'var(--shadow-lg)', backdropFilter: 'var(--backdrop-blur)' }}>
            <div className="context-menu-item" onClick={() => { onCloseTab(tab.path); onClose(); }} style={{ padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', borderRadius: 'var(--radius-sm)' }}>
                <Icon name="x" size={14} />
                Close
            </div>
        </div>
    );
};

interface TabBarProps {
    tabs: OpenTab[];
    activeTab: string | null;
    onTabSelect: (path: string) => void;
    onTabClose: (path: string) => void;
    onRun?: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
    tabs,
    activeTab,
    onTabSelect,
    onTabClose,
    onRun
}) => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tab: OpenTab } | null>(null);

    if (tabs.length === 0) {
        return (
            <div className="tab-bar empty" style={{ display: 'flex', alignItems: 'center', padding: '0 20px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                <Icon name="files" size={16} />
                <span style={{ marginLeft: 8 }}>No files open</span>
            </div>
        );
    }

    const getTabIcon = (name: string): string => {
        const ext = name.split('.').pop()?.toLowerCase();
        const iconMap: Record<string, string> = {
            'dryad': 'leaf',
            'ts': 'brand-typescript',
            'tsx': 'brand-typescript',
            'js': 'brand-javascript',
            'jsx': 'brand-javascript',
            'json': 'braces',
            'css': 'brand-css3',
            'html': 'brand-html5',
            'md': 'markdown',
            'rs': 'file-code',
            'toml': 'settings',
        };
        return iconMap[ext || ''] || 'file';
    };

    return (
        <>
            <div className="tab-bar">
                {tabs.map(tab => (
                    <div
                        key={tab.path}
                        className={`tab ${activeTab === tab.path ? 'active' : ''}`}
                        onClick={() => onTabSelect(tab.path)}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenu({ x: e.clientX, y: e.clientY, tab });
                        }}
                    >
                        <Icon name={getTabIcon(tab.name)} size={16} />
                        <span className="tab-name">{tab.name}</span>
                        {tab.isDirty && <div className="dirty-dot" />}
                        <button
                            className="tab-close"
                            onClick={(e) => {
                                e.stopPropagation();
                                onTabClose(tab.path);
                            }}
                        >
                            <Icon name="x" size={14} />
                        </button>
                    </div>
                ))}
            </div>
            {activeTab?.endsWith('.dryad') && onRun && (
                <div className="tab-actions" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', zIndex: 10 }}>
                    <button className="run-btn" onClick={onRun} title="Run Dryad Script" style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '4px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}>
                        <Icon name="player-play" size={18} />
                    </button>
                </div>
            )}
            {contextMenu && (
                <TabContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    tab={contextMenu.tab}
                    onClose={() => setContextMenu(null)}
                    onCloseTab={onTabClose}
                />
            )}
        </>
    );
};
