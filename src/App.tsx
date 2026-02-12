import { useEffect, useState, useCallback } from 'react';
import "./App.css";
import { invoke } from "@tauri-apps/api/core";
import { ActivityBar } from "./components/ActivityBar";
import { Sidebar, FileEntry } from "./components/Sidebar";
import { TabBar, OpenTab } from "./components/TabBar";
import { EditorArea } from "./components/EditorArea";
import { Panel } from "./components/Panel";
import { StatusBar } from "./components/StatusBar";
import { CommandPalette } from "./components/CommandPalette";
import { SettingsPanel, Settings } from "./components/SettingsPanel";
import { GitPanel } from "./components/GitPanel";
import { SearchPanel } from "./components/SearchPanel";
import { DebugPanel } from "./components/DebugPanel";
import { StartPage } from "./components/StartPage";
import { NewProjectWizard } from "./components/NewProjectWizard";

const defaultSettings: Settings = {
  theme: 'dark',
  fontSize: 14,
  fontFamily: 'JetBrains Mono',
  tabSize: 2,
  wordWrap: true,
  minimap: true,
  lineNumbers: true,
  autoSave: false,
  autoSaveDelay: 1000,
};

function App() {
  // UI State
  const [activeView, setActiveView] = useState('explorer');
  const [panelVisible, setPanelVisible] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Resizable Panel State
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('birch-sidebar-width');
    return saved ? parseInt(saved) : 240;
  });
  const [panelHeight, setPanelHeight] = useState(() => {
    const saved = localStorage.getItem('birch-panel-height');
    return saved ? parseInt(saved) : 200;
  });

  // Settings
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // File State
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [workspacePath, setWorkspacePath] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  // Recent Projects (Mock)
  const [recentProjects] = useState([
    { name: 'birch', path: '/home/pedro/Documentos/birch', lastOpened: 'Just now' },
    { name: 'dryad-core', path: '/home/pedro/projects/dryad', lastOpened: '2 hours ago' },
  ]);

  // Editor State
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Map<string, string>>(new Map());
  const [dirtyFiles, setDirtyFiles] = useState<Set<string>>(new Set());

  // Git State (mock for now)
  const [gitBranch] = useState('main');
  const [gitChanges] = useState([
    { path: './src/App.tsx', status: 'modified' as const },
  ]);

  // Cursor Position
  const [cursorLine] = useState(1);
  const [cursorCol] = useState(1);

  const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('birch-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings({ ...defaultSettings, ...parsed });
      document.body.setAttribute('data-theme', parsed.theme || 'dark');
    } else {
      document.body.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Save settings to localStorage
  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('birch-settings', JSON.stringify(newSettings));
    document.body.setAttribute('data-theme', newSettings.theme);
  };

  // Load root directory
  const loadDirectory = async (path: string): Promise<FileEntry[]> => {
    if (!isTauri) {
      return [
        { name: 'src', path: './src', is_dir: true },
        { name: 'README.md', path: './README.md', is_dir: false },
      ];
    }
    try {
      const entries = await invoke<FileEntry[]>('list_dir', { path });
      return entries;
    } catch (err) {
      console.error('Failed to list directory:', err);
      return [];
    }
  };

  useEffect(() => {
    if (workspacePath) {
      loadDirectory(workspacePath).then(setFiles);
    } else {
      setFiles([]);
    }
  }, [workspacePath]);

  const handleOpenFolder = async () => {
    if (isTauri) {
      try {
        // Mock dialog for now or use tauri/api
        // const selected = await open({ directory: true });
        // if (selected) setWorkspacePath(selected as string);
        const path = prompt('Enter folder path:', '/home/pedro/Documentos/birch');
        if (path) setWorkspacePath(path);
      } catch (err) {
        console.error(err);
      }
    } else {
      setWorkspacePath('/mock/project');
    }
  };

  const handleOpenFile = async () => {
    if (isTauri) {
      const path = prompt('Enter file path:');
      if (path) {
        // Direct open file logic
        const name = path.split('/').pop() || 'file';
        handleFileSelect({ name, path, is_dir: false });
      }
    }
  };

  const handleCreateProject = (name: string, location: string, template: string) => {
    console.log('Creating project:', { name, location, template });
    // Logic to create project structure
    setWizardOpen(false);
    setWorkspacePath(`${location}/${name}`);
  };

  const handleFolderExpand = async (path: string) => {
    const newExpanded = new Set(expandedFolders);

    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
      const children = await loadDirectory(path);
      setFiles(prevFiles => updateFileTree(prevFiles, path, children));
    }

    setExpandedFolders(newExpanded);
  };

  const updateFileTree = (files: FileEntry[], targetPath: string, children: FileEntry[]): FileEntry[] => {
    return files.map(file => {
      if (file.path === targetPath) {
        return { ...file, children };
      }
      if (file.children) {
        return { ...file, children: updateFileTree(file.children, targetPath, children) };
      }
      return file;
    });
  };

  const handleFileSelect = async (file: FileEntry) => {
    if (file.is_dir) return;

    const existingTab = openTabs.find(t => t.path === file.path);
    if (existingTab) {
      setActiveTab(file.path);
      return;
    }

    let content = '';
    if (isTauri) {
      try {
        content = await invoke<string>('read_file', { path: file.path });
      } catch (err) {
        console.error('Failed to read file:', err);
        content = '// Error reading file';
      }
    } else {
      content = '// Mock content for ' + file.name;
    }

    setOpenTabs(prev => [...prev, { path: file.path, name: file.name, isDirty: false }]);
    setFileContents(prev => new Map(prev).set(file.path, content));
    setActiveTab(file.path);
  };

  const handleTabClose = (path: string) => {
    setOpenTabs(prev => prev.filter(t => t.path !== path));
    setFileContents(prev => {
      const newMap = new Map(prev);
      newMap.delete(path);
      return newMap;
    });
    setDirtyFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(path);
      return newSet;
    });

    if (activeTab === path) {
      const remaining = openTabs.filter(t => t.path !== path);
      setActiveTab(remaining.length > 0 ? remaining[remaining.length - 1].path : null);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!activeTab || value === undefined) return;

    setFileContents((prev) => new Map(prev).set(activeTab, value));
    setDirtyFiles((prev) => new Set(prev).add(activeTab));
    setOpenTabs((prev) =>
      prev.map((t) => (t.path === activeTab ? { ...t, isDirty: true } : t))
    );
    setUnsavedChanges(true); // Marcar alterações como não salvas
  };

  const handleSave = useCallback(async () => {
    if (!activeTab || !isTauri) return;

    const content = fileContents.get(activeTab);
    if (content === undefined) return;

    try {
      await invoke('write_file', { path: activeTab, content });
      setDirtyFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(activeTab);
        return newSet;
      });
      setOpenTabs(prev => prev.map(t =>
        t.path === activeTab ? { ...t, isDirty: false } : t
      ));
    } catch (err) {
      console.error('Failed to save file:', err);
    }
  }, [activeTab, fileContents, isTauri]);

  // Commands for Command Palette
  const commands = [
    { id: 'save', label: 'Save File', icon: 'device-floppy', shortcut: 'Ctrl+S', action: handleSave, category: 'File' },
    { id: 'settings', label: 'Open Settings', icon: 'settings', shortcut: 'Ctrl+,', action: () => setSettingsOpen(true), category: 'Preferences' },
    { id: 'toggle-terminal', label: 'Toggle Terminal', icon: 'terminal-2', shortcut: 'Ctrl+`', action: () => setPanelVisible(v => !v), category: 'View' },
    { id: 'toggle-sidebar', label: 'Toggle Sidebar', icon: 'layout-sidebar-left-collapse', shortcut: 'Ctrl+B', action: () => setSidebarVisible(v => !v), category: 'View' },
    { id: 'close-tab', label: 'Close Tab', icon: 'x', shortcut: 'Ctrl+W', action: () => activeTab && handleTabClose(activeTab), category: 'File' },
    { id: 'explorer', label: 'Show Explorer', icon: 'files', action: () => setActiveView('explorer'), category: 'View' },
    { id: 'search', label: 'Show Search', icon: 'search', action: () => setActiveView('search'), category: 'View' },
    { id: 'git', label: 'Show Source Control', icon: 'git-branch', action: () => setActiveView('git'), category: 'View' },
  ];

  // Keyboard shortcuts 
  /*
  Ctrl+Shift+P - Open Command Palette
  Ctrl+S - Save File
  Ctrl+` - Toggle Terminal
  Ctrl+B - Toggle Sidebar
  Ctrl+, - Open Settings
  */

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        setSettingsOpen(true);
      }
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        setSidebarVisible(v => !v);
      }
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setActiveView('explorer');
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setActiveView('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  const activeContent = activeTab ? fileContents.get(activeTab) || '' : '';

  const renderSidePanel = () => {
    if (!sidebarVisible) return null;

    switch (activeView) {
      case 'explorer':
        return (
          <Sidebar
            files={files}
            activeFile={activeTab}
            onFileSelect={handleFileSelect}
            onFolderExpand={handleFolderExpand}
            expandedFolders={expandedFolders}
            width={sidebarWidth}
            onWidthChange={(w) => {
              setSidebarWidth(w);
              localStorage.setItem('birch-sidebar-width', String(w));
            }}
          />
        );
      case 'search':
        return <SearchPanel isVisible={true} onFileSelect={(path) => handleFileSelect({ name: path.split('/').pop() || '', path, is_dir: false })} />;
      case 'git':
        return (
          <GitPanel
            isVisible={true}
            branch={gitBranch}
            changes={gitChanges}
            onStageAll={() => console.log('Stage all')}
            onCommit={(msg) => console.log('Commit:', msg)}
            onFileClick={(path) => handleFileSelect({ name: path.split('/').pop() || '', path, is_dir: false })}
          />
        );
      case 'debug':
        return <DebugPanel />;
      default:
        return null;
    }
  };

  // Auto-Save State
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(settings.autoSave);
  const [autoSaveDelay, setAutoSaveDelay] = useState(settings.autoSaveDelay);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    if (autoSaveEnabled) {
      const interval = setInterval(() => {
        if (unsavedChanges) {
          console.log('Auto-saving changes...');
          if (activeTab) {
            const content = fileContents.get(activeTab);
            if (content !== undefined) {
              invoke('write_file', { path: activeTab, content })
                .then(() => {
                  console.log('File auto-saved:', activeTab);
                  setUnsavedChanges(false);
                })
                .catch((err) => console.error('Auto-save failed:', err));
            }
          }
        }
      }, autoSaveDelay);

      return () => clearInterval(interval);
    }
  }, [autoSaveEnabled, autoSaveDelay, unsavedChanges, activeTab, fileContents]);

  const simulateChange = () => {
    setUnsavedChanges(true);
  };

  return (
    <div className="app-container" data-theme={settings.theme}>
      <div className="main-content">
        <ActivityBar
          activeView={activeView}
          onViewChange={setActiveView}
          onSettingsClick={() => setSettingsOpen(true)}
        />

        {renderSidePanel()}

        <div className="editor-container">
          {!workspacePath && openTabs.length === 0 ? (
            <StartPage
              onOpenFolder={handleOpenFolder}
              onOpenFile={handleOpenFile}
              onCreateProject={() => setWizardOpen(true)}
              recentProjects={recentProjects}
            />
          ) : (
            <>
              <TabBar
                tabs={openTabs}
                activeTab={activeTab}
                onTabSelect={setActiveTab}
                onTabClose={handleTabClose}
                onTabReorder={setOpenTabs}
              />
              <EditorArea
                activeFile={activeTab}
                content={activeContent}
                onChange={handleEditorChange}
                settings={settings}
              />
            </>
          )}
        </div>
      </div>

      <NewProjectWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onCreate={handleCreateProject}
      />

      <Panel
        isVisible={panelVisible}
        onToggle={() => setPanelVisible(v => !v)}
        height={panelHeight}
        onHeightChange={(h) => {
          setPanelHeight(h);
          localStorage.setItem('birch-panel-height', String(h));
        }}
      />

      <StatusBar
        activeFile={activeTab}
        lineNumber={cursorLine}
        columnNumber={cursorCol}
        isDirty={activeTab ? dirtyFiles.has(activeTab) : false}
      />

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={commands}
      />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      <button onClick={simulateChange}>Simulate Change</button>
      <label>
        Auto-Save Enabled:
        <input
          type="checkbox"
          checked={autoSaveEnabled}
          onChange={(e) => setAutoSaveEnabled(e.target.checked)}
        />
      </label>
      <label>
        Auto-Save Delay (ms):
        <input
          type="number"
          value={autoSaveDelay}
          onChange={(e) => setAutoSaveDelay(Number(e.target.value))}
        />
      </label>
    </div>
  );
}

export default App;
