import { useState } from 'react';
import { ResizeHandle } from './ResizeHandle';
import { Icon } from './Icon';
import { FileContextMenu } from './FileContextMenu';
import '../App.css';

export interface FileEntry {
    name: string;
    path: string;
    is_dir: boolean;
    children?: FileEntry[];
}

interface FileTreeItemProps {
    entry: FileEntry;
    level: number;
    activeFile: string | null;
    expandedFolders: Set<string>;
    onFileSelect: (entry: FileEntry) => void;
    onToggleFolder: (path: string) => void;
    onContextMenu: (e: React.MouseEvent, entry: FileEntry) => void;
}

function getFileIconName(name: string, isDir: boolean, isExpanded?: boolean): string {
    if (isDir) return isExpanded ? 'folder-open' : 'folder';
    const ext = name.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
        'dryad': 'leaf',
        'ts': 'brand-typescript',
        'tsx': 'brand-typescript',
        'js': 'brand-javascript',
        'jsx': 'brand-javascript',
        'html': 'brand-html5',
        'css': 'brand-css3',
        'json': 'braces',
        'toml': 'settings',
        'md': 'markdown',
        'rs': 'file-code',
    };
    return iconMap[ext || ''] || 'file';
}

function getIconColor(name: string, isDir: boolean): string {
    if (isDir) return '#818cf8';
    const ext = name.split('.').pop()?.toLowerCase();
    const colorMap: Record<string, string> = {
        'dryad': '#4ade80',
        'ts': '#3178c6',
        'tsx': '#3178c6',
        'js': '#f7df1e',
        'jsx': '#f7df1e',
        'html': '#e34f26',
        'css': '#264de4',
        'md': '#519aba',
        'rs': '#dea584',
    };
    return colorMap[ext || ''] || 'var(--text-secondary)';
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ entry, level, activeFile, expandedFolders, onFileSelect, onToggleFolder, onContextMenu }) => {
    const isExpanded = expandedFolders.has(entry.path);
    const iconName = getFileIconName(entry.name, entry.is_dir, isExpanded);
    const iconColor = getIconColor(entry.name, entry.is_dir);

    return (
        <div className="tree-node">
            <div
                className={`tree-item ${activeFile === entry.path ? 'active' : ''}`}
                style={{ paddingLeft: `${16 + level * 12}px` }}
                onClick={() => entry.is_dir ? onToggleFolder(entry.path) : onFileSelect(entry)}
                onContextMenu={(e) => onContextMenu(e, entry)}
            >
                {entry.is_dir && (
                    <span className="tree-chevron" style={{ opacity: 0.6 }}>
                        <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size={12} />
                    </span>
                )}
                <span className="tree-file-icon" style={{ color: iconColor }}>
                    <Icon name={iconName} size={16} />
                </span>
                <span className="tree-name" style={{ fontWeight: entry.is_dir ? 600 : 400 }}>{entry.name}</span>
            </div>
            {entry.is_dir && isExpanded && entry.children && (
                <div className="tree-children" style={{ position: 'relative' }}>
                    <div className="indent-guide" style={{ position: 'absolute', left: `${22 + level * 12}px`, top: 0, bottom: 0, width: '1px', background: 'var(--border-subtle)' }} />
                    {entry.children.map(child => (
                        <FileTreeItem
                            key={child.path}
                            entry={child}
                            level={level + 1}
                            activeFile={activeFile}
                            expandedFolders={expandedFolders}
                            onFileSelect={onFileSelect}
                            onToggleFolder={onToggleFolder}
                            onContextMenu={onContextMenu}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

interface SidebarProps {
    files: FileEntry[];
    activeFile: string | null;
    onFileSelect: (file: FileEntry) => void;
    onFolderExpand: (path: string) => void;
    expandedFolders: Set<string>;
    width: number;
    onWidthChange: (width: number) => void;
    onRename: (path: string) => void;
    onDelete: (path: string) => void;
    onNewFile: (parent: string) => void;
    onNewFolder: (parent: string) => void;
    workspacePath: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    files, activeFile, onFileSelect, onFolderExpand, expandedFolders, 
    width, onWidthChange, onRename, onDelete, onNewFile, onNewFolder,
    workspacePath
}) => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: FileEntry } | null>(null);

    return (
        <aside className="sidebar" style={{ width: `${width}px` }}>
            <div className="sidebar-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon name="files" size={14} />
                    <span>EXPLORER</span>
                </div>
                <div className="sidebar-actions" style={{ display: 'flex', gap: '8px' }}>
                    <Icon name="plus" size={14} style={{ cursor: 'pointer' }} onClick={() => workspacePath && onNewFile(workspacePath)} />
                    <Icon name="folder-plus" size={14} style={{ cursor: 'pointer' }} onClick={() => workspacePath && onNewFolder(workspacePath)} />
                    <Icon name="refresh" size={14} style={{ cursor: 'pointer' }} />
                </div>
            </div>
            <div className="sidebar-content">
                {files.map(entry => (
                    <FileTreeItem
                        key={entry.path}
                        entry={entry}
                        level={0}
                        activeFile={activeFile}
                        expandedFolders={expandedFolders}
                        onFileSelect={onFileSelect}
                        onToggleFolder={onFolderExpand}
                        onContextMenu={(e, file) => {
                            e.preventDefault();
                            setContextMenu({ x: e.clientX, y: e.clientY, file });
                        }}
                    />
                ))}
            </div>
            <ResizeHandle direction="horizontal" onResize={(delta) => onWidthChange(width + delta)} className="sidebar-resize" />

            {contextMenu && (
                <FileContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    file={contextMenu.file}
                    onClose={() => setContextMenu(null)}
                    onRename={() => onRename(contextMenu.file.path)}
                    onDelete={() => onDelete(contextMenu.file.path)}
                    onNewFile={() => onNewFile(contextMenu.file.path)}
                    onNewFolder={() => onNewFolder(contextMenu.file.path)}
                    onCopyPath={() => navigator.clipboard.writeText(contextMenu.file.path)}
                />
            )}
        </aside>
    );
};
