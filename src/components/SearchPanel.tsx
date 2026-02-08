import React from 'react';
import { Icon } from './Icon';
import '../App.css';

interface SearchPanelProps {
    isVisible: boolean;
    onFileSelect: (path: string) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ isVisible, onFileSelect }) => {
    const [query, setQuery] = React.useState('');
    const [results, setResults] = React.useState<Array<{ path: string; line: number; text: string }>>([]);
    const [isSearching, setIsSearching] = React.useState(false);

    if (!isVisible) return null;

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsSearching(true);

        // Mock search for now - will integrate with backend later
        setTimeout(() => {
            setResults([
                { path: './src/App.tsx', line: 10, text: 'function App() {' },
                { path: './src/main.tsx', line: 5, text: 'ReactDOM.createRoot' },
            ]);
            setIsSearching(false);
        }, 300);
    };

    return (
        <aside className="search-panel sidebar">
            <div className="sidebar-header">SEARCH</div>

            <div className="search-input-container">
                <Icon name="search" size={14} />
                <input
                    type="text"
                    placeholder="Search files..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="search-input"
                />
            </div>

            <div className="search-options">
                <label className="search-option">
                    <input type="checkbox" /> Match Case
                </label>
                <label className="search-option">
                    <input type="checkbox" /> Regex
                </label>
            </div>

            <div className="search-results">
                {isSearching && <div className="search-loading">Searching...</div>}
                {!isSearching && results.length === 0 && query && (
                    <div className="search-empty">No results found</div>
                )}
                {results.map((result, i) => (
                    <div
                        key={i}
                        className="search-result"
                        onClick={() => onFileSelect(result.path)}
                    >
                        <div className="search-result-file">
                            <Icon name="file" size={12} />
                            {result.path.split('/').pop()}
                        </div>
                        <div className="search-result-line">
                            <span className="line-number">{result.line}:</span>
                            <span className="line-text">{result.text}</span>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};
