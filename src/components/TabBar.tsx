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
    onCloseOthers: (path: string) => void;
    onCloseAll: () => void;
    onCloseRight: (path: string) => void;
    onCopyPath: (path: string) => void;
}

const TabContextMenu: React.FC<TabContextMenuProps> = ({
    x,
    y,
    tab,
    onClose,
    onCloseTab,
    onCloseOthers,
    onCloseAll,
    onCloseRight,
    onCopyPath,
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
        <div className="context-menu" ref={menuRef} style={{ left: x, top: y }}>
            <div className="context-menu-item" onClick={() => { onCloseTab(tab.path); onClose(); }}>
                <Icon name="x" size={14} />
                Close
                <span className="context-menu-shortcut">Ctrl+W</span>
            </div>
            <div className="context-menu-item" onClick={() => { onCloseOthers(tab.path); onClose(); }}>
                <Icon name="layout-columns" size={14} />
                Close Others
            </div>
            <div className="context-menu-item" onClick={() => { onCloseRight(tab.path); onClose(); }}>
                <Icon name="layout-align-left" size={14} />
                Close to the Right
            </div>
            <div className="context-menu-item" onClick={() => { onCloseAll(); onClose(); }}>
                <Icon name="square-x" size={14} />
                Close All
            </div>
            <div className="context-menu-divider" />
            <div className="context-menu-item" onClick={() => { onCopyPath(tab.path); onClose(); }}>
                <Icon name="copy" size={14} />
                Copy Path
            </div>
        </div>
    );
};

interface TabBarProps {
    tabs: OpenTab[];
    activeTab: string | null;
    onTabSelect: (path: string) => void;
    onTabClose: (path: string) => void;
    onTabReorder?: (tabs: OpenTab[]) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
    tabs,
    activeTab,
    onTabSelect,
    onTabClose,
    onTabReorder
}) => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; tab: OpenTab } | null>(null);
    const [draggedTab, setDraggedTab] = useState<string | null>(null);
    const [dragOverTab, setDragOverTab] = useState<string | null>(null);

    if (tabs.length === 0) {
        return (
            <div className="tab-bar empty">
                <Icon name="files" size={16} style={{ marginRight: 8, opacity: 0.5 }} />
                No files open
            </div>
        );
    }

    const handleContextMenu = (e: React.MouseEvent, tab: OpenTab) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, tab });
    };

    const handleCloseOthers = (path: string) => {
        tabs.filter(t => t.path !== path).forEach(t => onTabClose(t.path));
    };

    const handleCloseAll = () => {
        tabs.forEach(t => onTabClose(t.path));
    };

    const handleCloseRight = (path: string) => {
        const idx = tabs.findIndex(t => t.path === path);
        tabs.slice(idx + 1).forEach(t => onTabClose(t.path));
    };

    const handleCopyPath = (path: string) => {
        navigator.clipboard.writeText(path);
    };

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, path: string) => {
        setDraggedTab(path);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', path);
    };

    const handleDragOver = (e: React.DragEvent, path: string) => {
        e.preventDefault();
        if (draggedTab && draggedTab !== path) {
            setDragOverTab(path);
        }
    };

    const handleDragLeave = () => {
        setDragOverTab(null);
    };

    const handleDrop = (e: React.DragEvent, targetPath: string) => {
        e.preventDefault();
        if (!draggedTab || draggedTab === targetPath) {
            setDraggedTab(null);
            setDragOverTab(null);
            return;
        }

        const newTabs = [...tabs];
        const draggedIdx = newTabs.findIndex(t => t.path === draggedTab);
        const targetIdx = newTabs.findIndex(t => t.path === targetPath);

        if (draggedIdx !== -1 && targetIdx !== -1) {
            const [removed] = newTabs.splice(draggedIdx, 1);
            newTabs.splice(targetIdx, 0, removed);
            onTabReorder?.(newTabs);
        }

        setDraggedTab(null);
        setDragOverTab(null);
    };

    const handleDragEnd = () => {
        setDraggedTab(null);
        setDragOverTab(null);
    };

    // Get file icon based on extension
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
                        className={`tab ${activeTab === tab.path ? 'active' : ''} ${draggedTab === tab.path ? 'dragging' : ''} ${dragOverTab === tab.path ? 'drag-over' : ''}`}
                        onClick={() => onTabSelect(tab.path)}
                        onContextMenu={(e) => handleContextMenu(e, tab)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, tab.path)}
                        onDragOver={(e) => handleDragOver(e, tab.path)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, tab.path)}
                        onDragEnd={handleDragEnd}
                    >
                        <Icon name={getTabIcon(tab.name)} size={14} style={{ marginRight: 6, opacity: 0.7 }} />
                        <span className="tab-name">
                            {tab.isDirty && <span className="dirty-dot">●</span>}
                            {tab.name}
                        </span>
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
            {contextMenu && (
                <TabContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    tab={contextMenu.tab}
                    onClose={() => setContextMenu(null)}
                    onCloseTab={onTabClose}
                    onCloseOthers={handleCloseOthers}
                    onCloseAll={handleCloseAll}
                    onCloseRight={handleCloseRight}
                    onCopyPath={handleCopyPath}
                />
            )}
        </>
    );
};
