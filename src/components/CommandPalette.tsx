import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from './Icon';
import '../App.css';

interface Command {
    id: string;
    label: string;
    icon?: string;
    shortcut?: string;
    action: () => void;
    category?: string;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    commands: Command[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category?.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            inputRef.current?.focus();
        }
    }, [isOpen]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(i => Math.max(i - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    filteredCommands[selectedIndex].action();
                    onClose();
                }
                break;
            case 'Escape':
                onClose();
                break;
        }
    }, [filteredCommands, selectedIndex, onClose]);

    if (!isOpen) return null;

    return (
        <div className="command-palette-overlay" onClick={onClose}>
            <div className="command-palette" onClick={e => e.stopPropagation()}>
                <div className="command-palette-input-container">
                    <Icon name="search" size={16} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a command..."
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                        className="command-palette-input"
                    />
                </div>
                <div className="command-palette-list">
                    {filteredCommands.length === 0 ? (
                        <div className="command-palette-empty">No commands found</div>
                    ) : (
                        filteredCommands.map((cmd, index) => (
                            <div
                                key={cmd.id}
                                className={`command-palette-item ${index === selectedIndex ? 'selected' : ''}`}
                                onClick={() => {
                                    cmd.action();
                                    onClose();
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                {cmd.icon && <Icon name={cmd.icon} size={16} />}
                                <span className="command-label">{cmd.label}</span>
                                {cmd.shortcut && <span className="command-shortcut">{cmd.shortcut}</span>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
