import React, { useState } from 'react';
import { Icon } from './Icon';
import '../App.css';

export interface Settings {
    theme: 'dark' | 'light' | 'monokai' | 'solarized';
    fontSize: number;
    fontFamily: string;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
    lineNumbers: boolean;
    autoSave: boolean;
    autoSaveDelay: number;
}

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onSettingsChange: (settings: Settings) => void;
}

const themes = [
    { id: 'dark', name: 'Dark (Default)' },
    { id: 'light', name: 'Light' },
    { id: 'monokai', name: 'Monokai' },
    { id: 'solarized', name: 'Solarized Dark' },
];

const fonts = [
    'JetBrains Mono',
    'Fira Code',
    'Source Code Pro',
    'Cascadia Code',
    'Consolas',
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isOpen,
    onClose,
    settings,
    onSettingsChange
}) => {
    const [activeSection, setActiveSection] = useState('appearance');

    if (!isOpen) return null;

    const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-panel" onClick={e => e.stopPropagation()}>
                <div className="settings-header">
                    <h2>Settings</h2>
                    <button className="settings-close" onClick={onClose}>
                        <Icon name="x" size={18} />
                    </button>
                </div>

                <div className="settings-body">
                    <nav className="settings-nav">
                        <button
                            className={activeSection === 'appearance' ? 'active' : ''}
                            onClick={() => setActiveSection('appearance')}
                        >
                            <Icon name="palette" size={16} /> Appearance
                        </button>
                        <button
                            className={activeSection === 'editor' ? 'active' : ''}
                            onClick={() => setActiveSection('editor')}
                        >
                            <Icon name="code" size={16} /> Editor
                        </button>
                        <button
                            className={activeSection === 'features' ? 'active' : ''}
                            onClick={() => setActiveSection('features')}
                        >
                            <Icon name="settings" size={16} /> Features
                        </button>
                        <button
                            className={activeSection === 'keybindings' ? 'active' : ''}
                            onClick={() => setActiveSection('keybindings')}
                        >
                            <Icon name="keyboard" size={16} /> Keybindings
                        </button>
                    </nav>

                    <div className="settings-content">
                        {activeSection === 'appearance' && (
                            <div className="settings-section">
                                <h3>Theme</h3>
                                <div className="setting-row">
                                    <label>Color Theme</label>
                                    <select
                                        value={settings.theme}
                                        onChange={e => updateSetting('theme', e.target.value as Settings['theme'])}
                                    >
                                        {themes.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <h3>Font</h3>
                                <div className="setting-row">
                                    <label>Font Family</label>
                                    <select
                                        value={settings.fontFamily}
                                        onChange={e => updateSetting('fontFamily', e.target.value)}
                                    >
                                        {fonts.map(f => (
                                            <option key={f} value={f}>{f}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="setting-row">
                                    <label>Font Size</label>
                                    <input
                                        type="number"
                                        min={10}
                                        max={24}
                                        value={settings.fontSize}
                                        onChange={e => updateSetting('fontSize', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        )}

                        {activeSection === 'editor' && (
                            <div className="settings-section">
                                <h3>Editor</h3>
                                <div className="setting-row">
                                    <label>Tab Size</label>
                                    <input
                                        type="number"
                                        min={2}
                                        max={8}
                                        value={settings.tabSize}
                                        onChange={e => updateSetting('tabSize', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="setting-row toggle">
                                    <label>Word Wrap</label>
                                    <button
                                        className={`toggle-btn ${settings.wordWrap ? 'on' : ''}`}
                                        onClick={() => updateSetting('wordWrap', !settings.wordWrap)}
                                    >
                                        {settings.wordWrap ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                                <div className="setting-row toggle">
                                    <label>Minimap</label>
                                    <button
                                        className={`toggle-btn ${settings.minimap ? 'on' : ''}`}
                                        onClick={() => updateSetting('minimap', !settings.minimap)}
                                    >
                                        {settings.minimap ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                                <div className="setting-row toggle">
                                    <label>Line Numbers</label>
                                    <button
                                        className={`toggle-btn ${settings.lineNumbers ? 'on' : ''}`}
                                        onClick={() => updateSetting('lineNumbers', !settings.lineNumbers)}
                                    >
                                        {settings.lineNumbers ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeSection === 'features' && (
                            <div className="settings-section">
                                <h3>Auto Save</h3>
                                <div className="setting-row toggle">
                                    <label>Enable Auto Save</label>
                                    <button
                                        className={`toggle-btn ${settings.autoSave ? 'on' : ''}`}
                                        onClick={() => updateSetting('autoSave', !settings.autoSave)}
                                    >
                                        {settings.autoSave ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                                {settings.autoSave && (
                                    <div className="setting-row">
                                        <label>Auto Save Delay (ms)</label>
                                        <input
                                            type="number"
                                            min={500}
                                            max={10000}
                                            step={500}
                                            value={settings.autoSaveDelay}
                                            onChange={e => updateSetting('autoSaveDelay', parseInt(e.target.value))}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {activeSection === 'keybindings' && (
                            <div className="settings-section">
                                <h3>Keyboard Shortcuts</h3>
                                <div className="keybinding-list">
                                    <div className="keybinding-item">
                                        <span>Command Palette</span>
                                        <kbd>Ctrl+Shift+P</kbd>
                                    </div>
                                    <div className="keybinding-item">
                                        <span>Save File</span>
                                        <kbd>Ctrl+S</kbd>
                                    </div>
                                    <div className="keybinding-item">
                                        <span>Toggle Terminal</span>
                                        <kbd>Ctrl+`</kbd>
                                    </div>
                                    <div className="keybinding-item">
                                        <span>Toggle Sidebar</span>
                                        <kbd>Ctrl+B</kbd>
                                    </div>
                                    <div className="keybinding-item">
                                        <span>Close Tab</span>
                                        <kbd>Ctrl+W</kbd>
                                    </div>
                                    <div className="keybinding-item">
                                        <span>Open File</span>
                                        <kbd>Ctrl+O</kbd>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
