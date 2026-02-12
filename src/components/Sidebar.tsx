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

// Icon mapping for file extensions using SVG icons
function getFileIconName(name: string, isDir: boolean, isExpanded?: boolean): string {
    if (isDir) {
        return isExpanded ? 'folder-open' : 'folder';
    }

    // ... (rest of icon logic remains same, just ensuring imports are cleaner if I could, but I'll leave the function logic as is and just replace imports/interfaces)
    // Actually, I need to include the full function if I replace the whole file or matching block.
    // To save tokens, I'll use multi-replace or just replace the top and the component.

    const ext = name.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
        'dryad': 'leaf',
        'ts': 'brand-typescript',
        'tsx': 'brand-typescript',
        'js': 'brand-javascript',
        'jsx': 'brand-javascript',
        'html': 'brand-html5',
        'css': 'brand-css3',
        'scss': 'brand-sass',
        'json': 'braces',
        'toml': 'settings',
        'yaml': 'file-settings',
        'yml': 'file-settings',
        'env': 'lock',
        'md': 'markdown',
        'txt': 'file-text',
        'pdf': 'file-type-pdf',
        'png': 'photo',
        'jpg': 'photo',
        'jpeg': 'photo',
        'svg': 'vector',
        'gif': 'gif',
        'rs': 'file-code',
        'gitignore': 'git-branch',
        'lock': 'lock',
    };

    const nameMap: Record<string, string> = {
        'package.json': 'package',
        'tsconfig.json': 'brand-typescript',
        'vite.config.ts': 'flame',
        'readme.md': 'book',
        'license': 'license',
        'dockerfile': 'brand-docker',
        '.gitignore': 'git-branch',
        'oak.toml': 'tree',
        'oaklock.json': 'lock',
    };

    const lowerName = name.toLowerCase();
    if (nameMap[lowerName]) return nameMap[lowerName];
    return iconMap[ext || ''] || 'file';
}

function getIconColor(name: string, isDir: boolean): string {
    if (isDir) return '#dcb67a';

    const ext = name.split('.').pop()?.toLowerCase();
    const colorMap: Record<string, string> = {
        'dryad': '#4ade80',
        'ts': '#3178c6',
        'tsx': '#3178c6',
        'js': '#f7df1e',
        'jsx': '#f7df1e',
        'html': '#e34f26',
        'css': '#264de4',
        'scss': '#cf649a',
        'json': '#cbcb41',
        'md': '#519aba',
        'rs': '#dea584',
        'toml': '#9c4121',
        'yaml': '#cb171e',
        'yml': '#cb171e',
    };

    return colorMap[ext || ''] || 'var(--text-secondary)';
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
    entry,
    level,
    activeFile,
    expandedFolders,
    onFileSelect,
    onToggleFolder,
    onContextMenu,
}) => {
    const isExpanded = expandedFolders.has(entry.path);
    const iconName = getFileIconName(entry.name, entry.is_dir, isExpanded);
    const iconColor = getIconColor(entry.name, entry.is_dir);

    return (
        <>
            <div
                className={`tree-item ${activeFile === entry.path ? 'active' : ''}`}
                style={{ paddingLeft: `${12 + level * 16}px` }}
                onClick={() => entry.is_dir ? onToggleFolder(entry.path) : onFileSelect(entry)}
                onContextMenu={(e) => onContextMenu(e, entry)}
            >
                {entry.is_dir && (
                    <span className="tree-chevron">
                        <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size={14} />
                    </span>
                )}
                <span className="tree-file-icon" style={{ color: iconColor }}>
                    <Icon name={iconName} size={16} />
                </span>
                <span className="tree-name">{entry.name}</span>
            </div>
            {entry.is_dir && isExpanded && (
                <div className="tree-children">
                    <div
                        className="tree-indent-guide"
                        style={{ left: `${20 + level * 16}px` }}
                    />
                    {entry.children?.map(child => (
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
        </>
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
}

const MIN_WIDTH = 180;
const MAX_WIDTH = 500;

export const Sidebar: React.FC<SidebarProps> = ({
    files,
    activeFile,
    onFileSelect,
    onFolderExpand,
    expandedFolders,
    width,
    onWidthChange,
}) => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; file: FileEntry } | null>(null);

    const handleResize = (delta: number) => {
        const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width + delta));
        onWidthChange(newWidth);
    };

    const handleContextMenu = (e: React.MouseEvent, file: FileEntry) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, file });
    };

    const handleNewFile = (path: string) => {
        console.log('Creating new file at', path);
        // Implement logic to create a new file in the specified path
    };

    const handleNewFolder = (path: string) => {
        console.log('Creating new folder at', path);
        // Implement logic to create a new folder in the specified path
    };

    const handleRename = (path: string) => {
        console.log('Renaming file/folder at', path);
        // Implement logic to rename the specified file or folder
    };

    const handleDelete = (path: string) => {
        console.log('Deleting file/folder at', path);
        // Implement logic to delete the specified file or folder
    };

    return (
        <aside className="sidebar" style={{ width: `${width}px` }}>
            <div className="sidebar-header">
                <Icon name="files" size={14} />
                <span>EXPLORER</span>
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
                        onContextMenu={handleContextMenu}
                    />
                ))}
            </div>
            <ResizeHandle direction="horizontal" onResize={handleResize} className="sidebar-resize" />

            {contextMenu && (
                <FileContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    file={contextMenu.file}
                    onClose={() => setContextMenu(null)}
                    onRename={handleRename}
                    onDelete={handleDelete}
                    onNewFile={handleNewFile}
                    onNewFolder={handleNewFolder}
                    onCopyPath={(path) => {
                        navigator.clipboard.writeText(path);
                        console.log('Copied path', path);
                    }}
                />
            )}
        </aside>
    );
};
