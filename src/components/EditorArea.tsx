import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import '../App.css';

interface EditorAreaProps {
    activeFile: string | null;
    content: string;
    onChange: (value: string | undefined) => void;
}

function getLanguage(filename: string | null): string {
    if (!filename) return 'plaintext';
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'dryad': return 'rust'; // Use rust as base, we'll customize later
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

export const EditorArea: React.FC<EditorAreaProps> = ({ activeFile, content, onChange }) => {
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
            tokenizer: {
                root: [
                    [/[a-z_$][\w$]*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
                    [/[A-Z][\w$]*/, { cases: { '@typeKeywords': 'type', '@default': 'type.identifier' } }],
                    [/".*?"/, 'string'],
                    [/'.'/, 'string'],
                    [/\/\/.*$/, 'comment'],
                    [/\/\*/, 'comment', '@comment'],
                    [/\d+(\.\d+)?/, 'number'],
                ],
                comment: [
                    [/[^/*]+/, 'comment'],
                    [/\*\//, 'comment', '@pop'],
                    [/./, 'comment']
                ],
            },
        });
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

    return (
        <div className="editor-area">
            <Editor
                height="100%"
                language={getLanguage(activeFile)}
                value={content}
                theme="vs-dark"
                onChange={onChange}
                onMount={handleEditorMount}
                options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    minimap: { enabled: true },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    cursorBlinking: 'smooth',
                    smoothScrolling: true,
                }}
            />
        </div>
    );
};
