import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import '../App.css';
import { invoke } from '@tauri-apps/api/core';

interface EditorAreaProps {
    activeFile: string | null;
    content: string;
    onChange: (value: string | undefined) => void;
    settings: any;
}

function getLanguage(filename: string | null): string {
    if (!filename) return 'plaintext';
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'dryad': return 'dryad'; // Use our custom dryad language
        case 'rs': return 'rust';
        case 'ts':
        case 'tsx': return 'typescript';
        case 'js':
        case 'jsx': return 'javascript';
        case 'json': return 'json';
        case 'md': return 'markdown';
        case 'css': return 'css';
        case 'html': return 'html';
        case 'toml': return 'toml';
        default: return 'plaintext';
    }
}

export const EditorArea: React.FC<EditorAreaProps> = ({ activeFile, content, onChange, settings }) => {
    const editorRef = useRef<any>(null);

    const handleEditorMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;

        // Custom Dryad language (basic)
        monaco.languages.register({ id: 'dryad' });
        monaco.languages.setMonarchTokensProvider('dryad', {
            keywords: [
                'module', 'where', 'def', 'do', 'end', 'if', 'then', 'else',
                'match', 'with', 'let', 'in', 'type', 'data', 'class', 'instance',
                'import', 'export', 'pub', 'mut', 'ref', 'return', 'for', 'while'
            ],
            typeKeywords: ['Int', 'Float', 'String', 'Bool', 'List', 'Option', 'Result'],
            operators: ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>=', '->', '=>', '|>', '::'],
            symbols:  /[=><!~?:&|+\-*\/\^%]+/,
            escapes: /\\(?:[abfnrtv"\'\\]|x[0-9A-Fa-f]{1,4}|u{[0-9A-Fa-f]+}|u[0-9A-Fa-f]{4})/, 
            tokenizer: {
                root: [
                    [/[a-z_$][\w$]*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
                    [/[A-Z][\w$]*/, { cases: { '@typeKeywords': 'type', '@default': 'type.identifier' } }],
                    [/".*?"/, 'string'],
                    [/'[^\\']'/, 'string'],
                    [/\d+/, 'number'],
                    [/\/\/.*/, 'comment'],
                    [/\/*/, 'comment', '@comment'],
                    [/@symbols/, {
                        cases: {
                            '@operators': 'operator',
                            '@default'  : ''
                        }
                    }],
                ],
                comment: [
                    [/[^/*]+/, 'comment'],
                    [/\*\//, 'comment', '@pop'],
                    [/./, 'comment']
                ],
            },
        });
    };

    const runDryadScript = async () => {
        if (activeFile) {
            try {
                const result = await invoke<string>('run_dryad_script', { path: activeFile });
                console.log('Dryad Script Output:', result);
            } catch (error) {
                console.error('Failed to run Dryad script:', error);
            }
        }
    };

    if (!activeFile) {
        return (
            <div className="editor-area empty">
                <div className="empty-state">
                    <span className="empty-icon">📝</span>
                    <p>Select a file to start editing</p>
                    <p className="empty-hint">Or use Ctrl+P to open a file</p>
                </div>
            </div>
        );
    }

    const monacoTheme = settings.theme === 'light' ? 'vs' : 'vs-dark';

    return (
        <div className="editor-area">
            <Editor
                height="100%"
                language={getLanguage(activeFile)}
                value={content}
                theme={monacoTheme}
                onChange={onChange}
                onMount={handleEditorMount}
                options={{
                    fontSize: settings.fontSize || 14,
                    fontFamily: `${settings.fontFamily || 'JetBrains Mono'}, monospace`,
                    minimap: { enabled: settings.minimap },
                    lineNumbers: settings.lineNumbers ? 'on' : 'off',
                    wordWrap: settings.wordWrap ? 'on' : 'off',
                    tabSize: settings.tabSize || 2,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    cursorBlinking: 'smooth',
                    smoothScrolling: true,
                }}
            />
            <button onClick={runDryadScript}>Run Dryad Script</button>
        </div>
    );
};
