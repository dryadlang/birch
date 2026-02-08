import React, { useState } from 'react';
import { Icon } from './Icon';
import '../App.css';

interface NewProjectWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, location: string, template: string) => void;
}

const templates = [
    { id: 'console', name: 'Console Application', icon: 'terminal-2', desc: 'Simple command-line application' },
    { id: 'library', name: 'Dryad Library', icon: 'books', desc: 'Reusable package for other projects' },
    { id: 'network', name: 'Network Service', icon: 'server', desc: 'Backend service with HTTP/TCP capabilities' },
    { id: 'web', name: 'Web Assembly', icon: 'browser', desc: 'WASM module for web applications' },
];

export const NewProjectWizard: React.FC<NewProjectWizardProps> = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('untitled-project');
    const [location, setLocation] = useState('/home/user/projects');
    const [selectedTemplate, setSelectedTemplate] = useState('console');

    if (!isOpen) return null;

    return (
        <div className="wizard-overlay">
            <div className="wizard-panel">
                <div className="wizard-header">
                    <h2>
                        <Icon name="wand" size={20} />
                        New Dryad Project
                    </h2>
                    <button className="settings-close" onClick={onClose}>
                        <Icon name="x" size={18} />
                    </button>
                </div>
                <div className="wizard-body">
                    <div className="wizard-field">
                        <label>Project Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="my-awesome-project"
                        />
                    </div>
                    <div className="wizard-field">
                        <label>Location</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                            />
                            <button className="wizard-btn wizard-btn-secondary" title="Browse...">
                                <Icon name="folder" size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="wizard-field">
                        <label>Template</label>
                        <div className="wizard-templates">
                            {templates.map(t => (
                                <div
                                    key={t.id}
                                    className={`wizard-template ${selectedTemplate === t.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedTemplate(t.id)}
                                >
                                    <div className="wizard-template-icon">
                                        <Icon name={t.icon} size={24} />
                                    </div>
                                    <div className="wizard-template-name">{t.name}</div>
                                    <div className="wizard-template-desc">{t.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="wizard-footer">
                    <button className="wizard-btn wizard-btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="wizard-btn wizard-btn-primary"
                        onClick={() => onCreate(name, location, selectedTemplate)}
                        disabled={!name || !location}
                    >
                        Create Project
                    </button>
                </div>
            </div>
        </div>
    );
};
