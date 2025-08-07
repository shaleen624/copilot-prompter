import * as vscode from 'vscode';
import { ApiService, Template } from '../services/apiService';

export class TemplateItem extends vscode.TreeItem {
    constructor(
        public readonly template: Template,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(template.title, collapsibleState);
        
        this.tooltip = `${template.title}\n\n${template.description}\n\nLanguage: ${template.language}\nFramework: ${template.framework}\nAuthor: ${template.author}`;
        this.description = `${template.language} | ${template.framework}`;
        this.contextValue = 'template';
        
        // Set icon based on framework/language
        this.iconPath = this.getFrameworkIcon(template.framework, template.language);
        
        // Make it clickable
        this.command = {
            command: 'copilot-prompter.openTemplateDetail',
            title: 'Open Template',
            arguments: [template]
        };
    }

    private getFrameworkIcon(framework: string, language: string): vscode.ThemeIcon {
        const iconMap: { [key: string]: string } = {
            'React': 'react',
            'Angular': 'angular',
            'Vue': 'vue',
            'Next.js': 'react',
            'Nuxt.js': 'vue',
            'Express': 'server',
            'Spring Boot': 'java',
            'Django': 'python',
            'Flask': 'python',
            'Laravel': 'php',
            'Docker': 'docker',
            'Kubernetes': 'kubernetes',
            'JavaScript': 'file-code',
            'TypeScript': 'file-code',
            'Python': 'file-code',
            'Java': 'file-code',
            'C#': 'file-code'
        };
        
        return new vscode.ThemeIcon(iconMap[framework] || iconMap[language] || 'settings');
    }
}

export class TemplateCategory extends vscode.TreeItem {
    constructor(
        public readonly category: string,
        public readonly templates: Template[]
    ) {
        super(category, vscode.TreeItemCollapsibleState.Collapsed);
        
        this.tooltip = `${category} (${templates.length} templates)`;
        this.description = `${templates.length} templates`;
        this.contextValue = 'templateCategory';
        this.iconPath = new vscode.ThemeIcon('folder');
    }
}

export class TemplatesProvider implements vscode.TreeDataProvider<TemplateItem | TemplateCategory> {
    private _onDidChangeTreeData: vscode.EventEmitter<TemplateItem | TemplateCategory | undefined | null | void> = new vscode.EventEmitter<TemplateItem | TemplateCategory | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<TemplateItem | TemplateCategory | undefined | null | void> = this._onDidChangeTreeData.event;

    private templates: Template[] = [];
    private groupByCategory = true;

    constructor(private apiService: ApiService) {
        this.loadTemplates();
    }

    refresh(): void {
        this.loadTemplates();
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TemplateItem | TemplateCategory): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TemplateItem | TemplateCategory): Thenable<(TemplateItem | TemplateCategory)[]> {
        if (!element) {
            // Root level
            if (this.groupByCategory) {
                return Promise.resolve(this.getCategorizedTemplates());
            } else {
                return Promise.resolve(this.templates.map(template => 
                    new TemplateItem(template, vscode.TreeItemCollapsibleState.None)
                ));
            }
        } else if (element instanceof TemplateCategory) {
            // Show templates in category
            return Promise.resolve(element.templates.map(template => 
                new TemplateItem(template, vscode.TreeItemCollapsibleState.None)
            ));
        } else {
            // Template items have no children
            return Promise.resolve([]);
        }
    }

    private getCategorizedTemplates(): (TemplateCategory | TemplateItem)[] {
        if (this.templates.length === 0) {
            return [];
        }

        // Group templates by category
        const categories = new Map<string, Template[]>();
        
        for (const template of this.templates) {
            const category = template.category || 'Uncategorized';
            if (!categories.has(category)) {
                categories.set(category, []);
            }
            categories.get(category)!.push(template);
        }

        // Convert to tree items
        const items: (TemplateCategory | TemplateItem)[] = [];
        
        for (const [category, templates] of categories.entries()) {
            if (templates.length === 1) {
                // If only one template in category, show it directly
                items.push(new TemplateItem(templates[0]!, vscode.TreeItemCollapsibleState.None));
            } else {
                // Show category with children
                items.push(new TemplateCategory(category, templates));
            }
        }

        return items.sort((a, b) => {
            if (a instanceof TemplateCategory && b instanceof TemplateCategory) {
                return a.category.localeCompare(b.category);
            } else if (a instanceof TemplateItem && b instanceof TemplateItem) {
                return a.template.title.localeCompare(b.template.title);
            } else {
                return a instanceof TemplateCategory ? -1 : 1;
            }
        });
    }

    private async loadTemplates(): Promise<void> {
        try {
            this.templates = await this.apiService.getTemplates();
        } catch (error) {
            console.error('Failed to load templates:', error);
            this.templates = [];
            
            if (error instanceof Error && error.message.includes('401')) {
                vscode.window.showWarningMessage(
                    'Authentication required to load templates',
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

    async searchTemplates(query: string): Promise<void> {
        try {
            this.templates = await this.apiService.searchTemplates(query);
            this._onDidChangeTreeData.fire();
        } catch (error) {
            vscode.window.showErrorMessage(`Template search failed: ${error}`);
        }
    }

    async showAllTemplates(): Promise<void> {
        await this.loadTemplates();
        this._onDidChangeTreeData.fire();
    }
}
