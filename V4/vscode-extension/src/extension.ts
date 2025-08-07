import * as vscode from 'vscode';
import { CopilotPrompterChatParticipant } from './chatParticipant';
import { ApiService } from './services/apiService';
import { AuthService } from './services/authService';
import { PromptsProvider } from './providers/promptsProvider';
import { TemplatesProvider } from './providers/templatesProvider';
import { CommandHandlers } from './commands/commandHandlers';

export function activate(context: vscode.ExtensionContext) {
    console.log('Copilot Prompter extension is now active!');

    // Initialize services
    const apiService = new ApiService();
    const authService = new AuthService(context, apiService);

    // Initialize providers
    const promptsProvider = new PromptsProvider(apiService);
    const templatesProvider = new TemplatesProvider(apiService);

    // Register tree data providers
    vscode.window.createTreeView('copilot-prompter.prompts', {
        treeDataProvider: promptsProvider,
        showCollapseAll: true
    });

    vscode.window.createTreeView('copilot-prompter.templates', {
        treeDataProvider: templatesProvider,
        showCollapseAll: true
    });

    // Initialize chat participant
    const chatParticipant = new CopilotPrompterChatParticipant(apiService, authService);

    // Register the chat participant
    const participant = vscode.chat.createChatParticipant('copilot-prompter.chat', chatParticipant.handler.bind(chatParticipant));
    participant.iconPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'icon.png');
    participant.followupProvider = {
        provideFollowups: chatParticipant.provideFollowups.bind(chatParticipant)
    };

    // Register all command handlers
    CommandHandlers.registerCommands(context);

    // Register main commands
    context.subscriptions.push(
        vscode.commands.registerCommand('copilot-prompter.openPrompts', () => {
            vscode.env.openExternal(vscode.Uri.parse(`${apiService.getBaseUrl()}/prompts`));
        }),

        vscode.commands.registerCommand('copilot-prompter.openTemplates', () => {
            vscode.env.openExternal(vscode.Uri.parse(`${apiService.getBaseUrl()}/templates`));
        }),

        vscode.commands.registerCommand('copilot-prompter.switchBackend', async () => {
            const current = vscode.workspace.getConfiguration('copilot-prompter').get('backend');
            const newBackend = current === 'node' ? 'java' : 'node';
            
            await vscode.workspace.getConfiguration('copilot-prompter').update('backend', newBackend, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Switched to ${newBackend.toUpperCase()} backend`);
            
            // Notify auth service about backend change
            await authService.onBackendChanged();
            
            // Refresh providers
            promptsProvider.refresh();
            templatesProvider.refresh();
        }),

        vscode.commands.registerCommand('copilot-prompter.authenticate', async () => {
            await authService.authenticate();
        }),

        vscode.commands.registerCommand('copilot-prompter.searchPrompts', async () => {
            const query = await vscode.window.showInputBox({
                prompt: 'Search prompts...',
                placeHolder: 'Enter search terms'
            });
            
            if (query) {
                try {
                    const prompts = await apiService.searchPrompts(query);
                    const items = prompts.map((p: any) => ({
                        label: p.title,
                        description: p.description,
                        detail: `${p.language} | ${p.category}`,
                        prompt: p
                    }));
                    
                    const selected = await vscode.window.showQuickPick(items, {
                        placeHolder: 'Select a prompt to use'
                    });
                    
                    if (selected) {
                        await vscode.env.clipboard.writeText((selected as any).prompt.prompt);
                        vscode.window.showInformationMessage(`Copied "${(selected as any).label}" to clipboard`);
                    }
                } catch (error) {
                    vscode.window.showErrorMessage(`Search failed: ${error}`);
                }
            }
        }),

        participant
    );

    // Auto-authenticate if enabled
    const autoAuth = vscode.workspace.getConfiguration('copilot-prompter').get<boolean>('autoAuth');
    if (autoAuth) {
        authService.authenticate();
    }

    // Set authentication context
    vscode.commands.executeCommand('setContext', 'copilot-prompter.authenticated', authService.isAuthenticated());
    
    // Listen for authentication changes
    authService.onAuthenticationChanged((authenticated: any) => {
        vscode.commands.executeCommand('setContext', 'copilot-prompter.authenticated', authenticated);
        if (authenticated) {
            promptsProvider.refresh();
            templatesProvider.refresh();
        }
    });
}

export function deactivate() {
    console.log('Copilot Prompter extension is now deactivated!');
}
