import * as vscode from 'vscode';
import { ApiService } from './services/apiService';
import { AuthService } from './services/authService';

interface Prompt {
    id: string;
    title: string;
    prompt: string;
    description: string;
    category: string;
    language: string;
    author: string;
    tags: string[];
}

interface Template {
    id: string;
    title: string;
    content: string;
    description: string;
    category: string;
    language: string;
    framework: string;
    author: string;
    tags: string[];
}

export class CopilotPrompterChatParticipant {
    constructor(
        private apiService: ApiService,
        private authService: AuthService
    ) {}

    async handler(
        request: vscode.ChatRequest,
        _context: vscode.ChatContext,
        stream: vscode.ChatResponseStream,
        token: vscode.CancellationToken
    ): Promise<void> {
        try {
            if (!this.authService.isAuthenticated()) {
                stream.markdown('🔐 Please authenticate first using the `/auth` command or `Ctrl+Shift+P` → "Copilot Prompter: Authenticate"');
                return;
            }

            const command = request.command;
            const prompt = request.prompt.trim();

            switch (command) {
                case 'prompt':
                    await this.handlePromptCommand(prompt, stream, token);
                    break;
                case 'template':
                    await this.handleTemplateCommand(prompt, stream, token);
                    break;
                case 'search':
                    await this.handleSearchCommand(prompt, stream, token);
                    break;
                case 'backend':
                    await this.handleBackendCommand(prompt, stream);
                    break;
                case 'auth':
                    await this.handleAuthCommand(stream);
                    break;
                case 'help':
                    await this.handleHelpCommand(stream);
                    break;
                default:
                    await this.handleDefaultCommand(prompt, stream, token);
            }
        } catch (error) {
            stream.markdown(`❌ **Error**: ${error}`);
        }
    }

    private async handlePromptCommand(query: string, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<void> {
        if (!query) {
            stream.markdown('📝 **Available Prompts**\\n\\nUse `/prompt search <query>` to search for specific prompts.');
            
            try {
                const prompts = await this.apiService.getPrompts();
                if (prompts.length === 0) {
                    stream.markdown('\\n*No prompts found. Create some prompts first!*');
                    return;
                }

                stream.markdown('\\n**Recent Prompts:**\\n');
                const recentPrompts = prompts.slice(0, 5);
                
                for (const prompt of recentPrompts) {
                    if (token.isCancellationRequested) return;
                    
                    stream.markdown(`\\n**${prompt.title}**\\n`);
                    stream.markdown(`*${prompt.description}*\\n`);
                    stream.markdown(`Language: ${prompt.language} | Category: ${prompt.category}\\n`);
                    
                    stream.button({
                        command: 'copilot-prompter.usePrompt',
                        title: 'Use Prompt',
                        arguments: [prompt]
                    });
                }
            } catch (error) {
                stream.markdown(`Failed to fetch prompts: ${error}`);
            }
        } else {
            await this.searchAndDisplayPrompts(query, stream, token);
        }
    }

    private async handleTemplateCommand(query: string, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<void> {
        if (!query) {
            stream.markdown('🎯 **Available Templates**\\n\\nUse `/template search <query>` to search for specific templates.');
            
            try {
                const templates = await this.apiService.getTemplates();
                if (templates.length === 0) {
                    stream.markdown('\\n*No templates found. Create some templates first!*');
                    return;
                }

                stream.markdown('\\n**Recent Templates:**\\n');
                const recentTemplates = templates.slice(0, 5);
                
                for (const template of recentTemplates) {
                    if (token.isCancellationRequested) return;
                    
                    stream.markdown(`\\n**${template.title}**\\n`);
                    stream.markdown(`*${template.description}*\\n`);
                    stream.markdown(`Language: ${template.language} | Framework: ${template.framework}\\n`);
                    
                    stream.button({
                        command: 'copilot-prompter.useTemplate',
                        title: 'Use Template',
                        arguments: [template]
                    });
                }
            } catch (error) {
                stream.markdown(`Failed to fetch templates: ${error}`);
            }
        } else {
            await this.searchAndDisplayTemplates(query, stream, token);
        }
    }

    private async handleSearchCommand(query: string, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<void> {
        if (!query) {
            stream.markdown('🔍 **Search**\\n\\nUsage: `/search <query>`\\n\\nExample: `/search angular testing`');
            return;
        }

        stream.markdown(`🔍 **Searching for**: "${query}"\\n\\n`);
        
        try {
            // Search both prompts and templates
            const [prompts, templates] = await Promise.all([
                this.apiService.searchPrompts(query),
                this.apiService.searchTemplates(query)
            ]);

            if (prompts.length === 0 && templates.length === 0) {
                stream.markdown('*No results found. Try different keywords.*');
                return;
            }

            if (prompts.length > 0) {
                stream.markdown('**📝 Prompts:**\\n');
                await this.displayPrompts(prompts.slice(0, 3), stream, token);
            }

            if (templates.length > 0) {
                stream.markdown('\\n**🎯 Templates:**\\n');
                await this.displayTemplates(templates.slice(0, 3), stream, token);
            }
        } catch (error) {
            stream.markdown(`Search failed: ${error}`);
        }
    }

    private async handleBackendCommand(action: string, stream: vscode.ChatResponseStream): Promise<void> {
        const currentBackend = vscode.workspace.getConfiguration('copilot-prompter').get<string>('backend');
        
        if (!action) {
            stream.markdown(`🖥️ **Current Backend**: ${currentBackend?.toUpperCase()}\\n\\nUse \`/backend switch\` to toggle between Node.js and Java backends.`);
            return;
        }

        if (action === 'switch') {
            const newBackend = currentBackend === 'node' ? 'java' : 'node';
            await vscode.workspace.getConfiguration('copilot-prompter').update('backend', newBackend, vscode.ConfigurationTarget.Global);
            stream.markdown(`✅ Switched to **${newBackend.toUpperCase()}** backend`);
        } else {
            stream.markdown('Invalid action. Use `/backend switch` to toggle backends.');
        }
    }

    private async handleAuthCommand(stream: vscode.ChatResponseStream): Promise<void> {
        try {
            await this.authService.authenticate();
            stream.markdown('✅ **Authentication successful!**\\n\\nYou can now access prompts and templates.');
        } catch (error) {
            stream.markdown(`❌ **Authentication failed**: ${error}`);
        }
    }

    private async handleHelpCommand(stream: vscode.ChatResponseStream): Promise<void> {
        stream.markdown(`# 🤖 Copilot Prompter Chat Commands

## Available Commands:

### 📝 Prompts
- \`/prompt\` - Show recent prompts  
- \`/prompt search <query>\` - Search prompts

### 🎯 Templates  
- \`/template\` - Show recent templates
- \`/template search <query>\` - Search templates

### 🔍 Search
- \`/search <query>\` - Search both prompts and templates

### ⚙️ Settings
- \`/backend\` - Show current backend
- \`/backend switch\` - Switch between Node.js and Java backends

### 🔐 Authentication
- \`/auth\` - Authenticate with backend

### ❓ Help
- \`/help\` - Show this help message

## Examples:
- \`@copilot-prompter /search angular testing\`
- \`@copilot-prompter /prompt angular component\`
- \`@copilot-prompter /template react\`
- \`@copilot-prompter /backend switch\`

*Happy prompting! 🚀*`);
    }

    private async handleDefaultCommand(query: string, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<void> {
        if (!query) {
            await this.handleHelpCommand(stream);
            return;
        }

        // Default behavior: search for prompts and templates
        stream.markdown(`🔍 **Searching for**: "${query}"\\n\\n`);
        await this.handleSearchCommand(query, stream, token);
    }

    private async searchAndDisplayPrompts(query: string, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<void> {
        try {
            const prompts = await this.apiService.searchPrompts(query);
            await this.displayPrompts(prompts, stream, token);
        } catch (error) {
            stream.markdown(`Failed to search prompts: ${error}`);
        }
    }

    private async searchAndDisplayTemplates(query: string, stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<void> {
        try {
            const templates = await this.apiService.searchTemplates(query);
            await this.displayTemplates(templates, stream, token);
        } catch (error) {
            stream.markdown(`Failed to search templates: ${error}`);
        }
    }

    private async displayPrompts(prompts: Prompt[], stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<void> {
        if (prompts.length === 0) {
            stream.markdown('*No prompts found.*');
            return;
        }

        for (const prompt of prompts.slice(0, 5)) {
            if (token.isCancellationRequested) return;
            
            stream.markdown(`\\n**${prompt.title}**\\n`);
            stream.markdown(`*${prompt.description}*\\n`);
            stream.markdown(`Language: ${prompt.language} | Category: ${prompt.category}\\n`);
            
            if (prompt.tags.length > 0) {
                stream.markdown(`Tags: ${prompt.tags.join(', ')}\\n`);
            }
            
            stream.button({
                command: 'copilot-prompter.copyPrompt',
                title: '📋 Copy to Clipboard',
                arguments: [prompt.prompt, prompt.title]
            });
            
            stream.button({
                command: 'copilot-prompter.insertPrompt',
                title: '📝 Insert in Chat',
                arguments: [prompt.prompt]
            });
        }
    }

    private async displayTemplates(templates: Template[], stream: vscode.ChatResponseStream, token: vscode.CancellationToken): Promise<void> {
        if (templates.length === 0) {
            stream.markdown('*No templates found.*');
            return;
        }

        for (const template of templates.slice(0, 5)) {
            if (token.isCancellationRequested) return;
            
            stream.markdown(`\\n**${template.title}**\\n`);
            stream.markdown(`*${template.description}*\\n`);
            stream.markdown(`Language: ${template.language} | Framework: ${template.framework}\\n`);
            
            if (template.tags.length > 0) {
                stream.markdown(`Tags: ${template.tags.join(', ')}\\n`);
            }
            
            stream.button({
                command: 'copilot-prompter.copyTemplate',
                title: '📋 Copy to Clipboard',
                arguments: [template.content, template.title]
            });
            
            stream.button({
                command: 'copilot-prompter.createCopilotInstructions',
                title: '📄 Create copilot-instructions.md',
                arguments: [template.content, template.title]
            });
        }
    }

    async provideFollowups(
        _result: vscode.ChatResult,
        _context: vscode.ChatContext,
        _token: vscode.CancellationToken
    ): Promise<vscode.ChatFollowup[]> {
        return [
            {
                prompt: '/search',
                label: '🔍 Search prompts and templates'
            },
            {
                prompt: '/prompt',
                label: '📝 Browse prompts'
            },
            {
                prompt: '/template',
                label: '🎯 Browse templates'
            },
            {
                prompt: '/backend switch',
                label: '🔄 Switch backend'
            }
        ];
    }
}
