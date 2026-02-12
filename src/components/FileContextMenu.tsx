import React, { useRef, useEffect } from 'react';
import { Icon } from './Icon';
import '../App.css';
import { FileEntry } from './Sidebar';
import { invoke } from '@tauri-apps/api/core';

interface FileContextMenuProps {
    x: number;
    y: number;
    file: FileEntry;
    onClose: () => void;
    onRename: (path: string) => void;
    onDelete: (path: string) => void;
    onNewFile: (path: string) => void;
    onNewFolder: (path: string) => void;
    onCopyPath: (path: string) => void;
}

export const FileContextMenu: React.FC<FileContextMenuProps> = ({
    x,
    y,
    file,
    onClose,
    onRename,
    onDelete,
    onNewFile,
    onNewFolder,
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
            {file.is_dir && (
                <>
                    <div className="context-menu-item" onClick={() => { onNewFile(file.path); onClose(); }}>
                        <Icon name="file-plus" size={14} />
                        New File
                    </div>
                    <div className="context-menu-item" onClick={() => { onNewFolder(file.path); onClose(); }}>
                        <Icon name="folder-plus" size={14} />
                        New Folder
                    </div>
                    <div className="context-menu-divider" />
                </>
            )}

            <div className="context-menu-item" onClick={() => { onCopyPath(file.path); onClose(); }}>
                <Icon name="copy" size={14} />
                Copy Path
            </div>
            <div className="context-menu-item" onClick={() => { onCopyPath(file.name); onClose(); }}>
                <Icon name="copy" size={14} />
                Copy Name
            </div>

            <div className="context-menu-divider" />

            <div className="context-menu-item" onClick={() => { onRename(file.path); onClose(); }}>
                <Icon name="pencil" size={14} />
                Rename
                <span className="context-menu-shortcut">F2</span>
            </div>
            <div className="context-menu-item danger" onClick={() => { onDelete(file.path); onClose(); }}>
                <Icon name="trash" size={14} />
                Delete
                <span className="context-menu-shortcut">Delete</span>
            </div>
            <div className="context-menu-item" onClick={() => { invoke('open_in_external', { path: file.path }); onClose(); }}>
                <Icon name="folder-open" size={14} />
                Show in Explorer
            </div>
            <div className="context-menu-item" onClick={() => { invoke('open_terminal', { path: file.path }); onClose(); }}>
                <Icon name="terminal" size={14} />
                Open in Terminal
            </div>
            <div className="context-menu-divider" />

            <div className="context-menu-item" onClick={() => { invoke('show_open_dialog').then(result => console.log('Dialog result:', result)).catch(err => console.error('Dialog error:', err)); onClose(); }}>
                <Icon name="folder-open" size={14} />
                Test Open Dialog
            </div>
            <div className="context-menu-item" onClick={() => { invoke('show_notification', { title: 'Test', message: 'Notification test' }).then(() => console.log('Notification sent')).catch(err => console.error('Notification error:', err)); onClose(); }}>
                <Icon name="bell" size={14} />
                Test Notification
            </div>
            <div className="context-menu-item" onClick={() => { invoke('get_file_metadata', { path: file.path }).then(metadata => console.log('Metadata:', metadata)).catch(err => console.error('Metadata error:', err)); onClose(); }}>
                <Icon name="info" size={14} />
                Test Metadata
            </div>
            <div className="context-menu-divider" />
        </div>
    );
};
