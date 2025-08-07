import * as vscode from 'vscode';
import { ApiService, Prompt } from '../services/apiService';

export class PromptItem extends vscode.TreeItem {
    constructor(
        public readonly prompt: Prompt,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(prompt.title, collapsibleState);
        
        this.tooltip = `${prompt.title}\n\n${prompt.description}\n\nLanguage: ${prompt.language}\nCategory: ${prompt.category}\nAuthor: ${prompt.author}`;
        this.description = `${prompt.language} | ${prompt.category}`;
        this.contextValue = 'prompt';
        
        // Set icon based on language
        this.iconPath = this.getLanguageIcon(prompt.language);
        
        // Make it clickable
        this.command = {
            command: 'copilot-prompter.openPromptDetail',
            title: 'Open Prompt',
            arguments: [prompt]
        };
    }

    private getLanguageIcon(language: string): vscode.ThemeIcon {
        const iconMap: { [key: string]: string } = {
            'JavaScript': 'file-code',
            'TypeScript': 'file-code',
            'Python': 'file-code',
            'Java': 'file-code',
            'C#': 'file-code',
            'React': 'react',
            'Angular': 'angular',
            'Vue': 'vue',
            'HTML': 'file-code',
            'CSS': 'file-code',
            'SQL': 'database',
            'JSON': 'json',
            'YAML': 'settings',
            'Markdown': 'markdown',
            'Text': 'file-text'
        };
        
        return new vscode.ThemeIcon(iconMap[language] || 'file');
    }
}

export class CategoryItem extends vscode.TreeItem {
    constructor(
        public readonly category: string,
        public readonly prompts: Prompt[]
    ) {
        super(category, vscode.TreeItemCollapsibleState.Collapsed);
        
        this.tooltip = `${category} (${prompts.length} prompts)`;
        this.description = `${prompts.length} prompts`;
        this.contextValue = 'category';
        this.iconPath = new vscode.ThemeIcon('folder');
    }
}

export class PromptsProvider implements vscode.TreeDataProvider<PromptItem | CategoryItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<PromptItem | CategoryItem | undefined | null | void> = new vscode.EventEmitter<PromptItem | CategoryItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<PromptItem | CategoryItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private prompts: Prompt[] = [];
    private groupByCategory = true;

    constructor(private apiService: ApiService) {
        this.loadPrompts();
    }

    refresh(): void {
        this.loadPrompts();
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: PromptItem | CategoryItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PromptItem | CategoryItem): Thenable<(PromptItem | CategoryItem)[]> {
        if (!element) {
            // Root level
            if (this.groupByCategory) {
                return Promise.resolve(this.getCategorizedPrompts());
            } else {
                return Promise.resolve(this.prompts.map(prompt => 
                    new PromptItem(prompt, vscode.TreeItemCollapsibleState.None)
                ));
            }
        } else if (element instanceof CategoryItem) {
            // Show prompts in category
            return Promise.resolve(element.prompts.map(prompt => 
                new PromptItem(prompt, vscode.TreeItemCollapsibleState.None)
            ));
        } else {
            // Prompt items have no children
            return Promise.resolve([]);
        }
    }

    private getCategorizedPrompts(): (CategoryItem | PromptItem)[] {
        if (this.prompts.length === 0) {
            return [];
        }

        // Group prompts by category
        const categories = new Map<string, Prompt[]>();
        
        for (const prompt of this.prompts) {
            const category = prompt.category || 'Uncategorized';
            if (!categories.has(category)) {
                categories.set(category, []);
            }
            categories.get(category)!.push(prompt);
        }

        // Convert to tree items
        const items: (CategoryItem | PromptItem)[] = [];
        
        for (const [category, prompts] of categories.entries()) {
            if (prompts.length === 1) {
                // If only one prompt in category, show it directly
                items.push(new PromptItem(prompts[0]!, vscode.TreeItemCollapsibleState.None));
            } else {
                // Show category with children
                items.push(new CategoryItem(category, prompts));
            }
        }

        return items.sort((a, b) => {
            if (a instanceof CategoryItem && b instanceof CategoryItem) {
                return a.category.localeCompare(b.category);
            } else if (a instanceof PromptItem && b instanceof PromptItem) {
                return a.prompt.title.localeCompare(b.prompt.title);
            } else {
                return a instanceof CategoryItem ? -1 : 1;
            }
        });
    }

    private async loadPrompts(): Promise<void> {
        try {
            this.prompts = await this.apiService.getPrompts();
        } catch (error) {
            console.error('Failed to load prompts:', error);
            this.prompts = [];
            
            if (error instanceof Error && error.message.includes('401')) {
                vscode.window.showWarningMessage(
                    'Authentication required to load prompts',
                    'Authenticate'
                ).then(choice => {
                    if (choice === 'Authenticate') {
                        vscode.commands.executeCommand('copilot-prompter.authenticate');
                    }
                });
            }
        }
    }

    toggleGrouping(): void {
        this.groupByCategory = !this.groupByCategory;
        this._onDidChangeTreeData.fire();
    }

    async searchPrompts(query: string): Promise<void> {
        try {
            this.prompts = await this.apiService.searchPrompts(query);
            this._onDidChangeTreeData.fire();
        } catch (error) {
            vscode.window.showErrorMessage(`Search failed: ${error}`);
        }
    }

    async showAllPrompts(): Promise<void> {
        await this.loadPrompts();
        this._onDidChangeTreeData.fire();
    }
}
