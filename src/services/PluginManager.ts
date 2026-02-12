export interface BirchPlugin {
    id: string;
    name: string;
    version: string;
    description?: string;
    activate: (api: BirchAPI) => void;
    deactivate?: () => void;
}

export interface BirchAPI {
    editor: {
        addCommand: (id: string, run: () => void) => void;
        registerLanguage: (lang: any) => void;
    };
    ui: {
        showNotification: (message: string, type: 'info' | 'error') => void;
        registerSidebarView: (id: string, component: React.ReactNode) => void;
    };
}

export class PluginManager {
    private plugins: Map<string, BirchPlugin> = new Map();
    private api: BirchAPI;

    constructor(api: BirchAPI) {
        this.api = api;
    }

    async loadPlugin(plugin: BirchPlugin) {
        console.log(`Loading plugin: ${plugin.name} (${plugin.version})`);
        try {
            plugin.activate(this.api);
            this.plugins.set(plugin.id, plugin);
        } catch (e) {
            console.error(`Failed to activate plugin ${plugin.id}:`, e);
        }
    }

    unloadPlugin(id: string) {
        const plugin = this.plugins.get(id);
        if (plugin && plugin.deactivate) {
            plugin.deactivate();
        }
        this.plugins.delete(id);
    }
}
