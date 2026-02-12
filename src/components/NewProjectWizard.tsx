import React, { useState } from 'react';
import { Icon } from './Icon';
import { invoke } from '@tauri-apps/api/core';
import '../App.css';

interface NewProjectWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, location: string, template: string) => void;
}

const templates = [
    { id: 'dryad-project', name: 'Dryad Project', icon: 'terminal-2', desc: 'New Dryad console application' },
    { id: 'dryad-library', name: 'Dryad Library', icon: 'books', desc: 'New Dryad library package' },
    { id: 'network-service', name: 'Network Service', icon: 'server', desc: 'High-performance microservice' },
    { id: 'web-assembly', name: 'Web Assembly', icon: 'browser', desc: 'Dryad module for web applications' },
];

export const NewProjectWizard: React.FC<NewProjectWizardProps> = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('untitled-project');
    const [location, setLocation] = useState('C:/Users/Pedro Jesus/Documents/BirchProjects');
    const [selectedTemplate, setSelectedTemplate] = useState('dryad-project');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async () => {
        setIsCreating(true);
        setError(null);
        try {
            if (selectedTemplate.startsWith('dryad-')) {
                const type = selectedTemplate.split('-')[1];
                await invoke('create_dryad_project', { name, location, template: type });
            }
            onCreate(name, location, selectedTemplate);
            onClose();
        } catch (e: any) {
            setError(e.toString());
        } finally {
            setIsCreating(false);
        }
    };

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
                            disabled={isCreating}
                        />
                    </div>
                    <div className="wizard-field">
                        <label>Location</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                disabled={isCreating}
                            />
                            <button className="wizard-btn wizard-btn-secondary" title="Browse..." disabled={isCreating}>
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
                                    onClick={() => !isCreating && setSelectedTemplate(t.id)}
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
                    {error && <div style={{ color: 'var(--text-accent)', fontSize: '12px', marginTop: '12px' }}>{error}</div>}
                </div>
                <div className="wizard-footer">
                    <button className="wizard-btn wizard-btn-secondary" onClick={onClose} disabled={isCreating}>
                        Cancel
                    </button>
                    <button
                        className="wizard-btn wizard-btn-primary"
                        onClick={handleCreate}
                        disabled={!name || !location || isCreating}
                    >
                        {isCreating ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </div>
        </div>
    );
};
