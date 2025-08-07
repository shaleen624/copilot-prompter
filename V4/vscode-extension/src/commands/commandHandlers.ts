import * as vscode from 'vscode';
import { Prompt, Template } from '../services/apiService';

export class CommandHandlers {
    static registerCommands(context: vscode.ExtensionContext): void {
        // Prompt commands
        context.subscriptions.push(
            vscode.commands.registerCommand('copilot-prompter.copyPrompt', async (promptText: string, title: string) => {
                await vscode.env.clipboard.writeText(promptText);
                vscode.window.showInformationMessage(`Copied "${title}" to clipboard`);
            })
        );

        context.subscriptions.push(
            vscode.commands.registerCommand('copilot-prompter.insertPrompt', async (promptText: string) => {
                // Insert prompt into Copilot Chat
                await vscode.commands.executeCommand('workbench.panel.chat.view.copilot.focus');
                await vscode.commands.executeCommand('workbench.action.chat.sendToNewChat', {
                    message: promptText
                });
            })
        );

        context.subscriptions.push(
            vscode.commands.registerCommand('copilot-prompter.openPromptDetail', async (prompt: Prompt) => {
                const panel = vscode.window.createWebviewPanel(
                    'promptDetail',
                    `Prompt: ${prompt.title}`,
                    vscode.ViewColumn.One,
                    {
                        enableScripts: true,
                        retainContextWhenHidden: true
                    }
                );

                panel.webview.html = CommandHandlers.getPromptDetailHtml(prompt);
                
                panel.webview.onDidReceiveMessage(
                    async (message) => {
                        switch (message.command) {
                            case 'copy':
                                await vscode.env.clipboard.writeText(prompt.prompt);
                                vscode.window.showInformationMessage('Prompt copied to clipboard');
                                break;
                            case 'insertChat':
                                await vscode.commands.executeCommand('copilot-prompter.insertPrompt', prompt.prompt);
                                break;
                        }
                    }
                );
            })
        );

        // Template commands
        context.subscriptions.push(
            vscode.commands.registerCommand('copilot-prompter.copyTemplate', async (templateContent: string, title: string) => {
                await vscode.env.clipboard.writeText(templateContent);
                vscode.window.showInformationMessage(`Copied "${title}" to clipboard`);
            })
        );

        context.subscriptions.push(
            vscode.commands.registerCommand('copilot-prompter.createCopilotInstructions', async (templateContent: string, title: string) => {
                const workspaceFolders = vscode.workspace.workspaceFolders;
                if (!workspaceFolders) {
                    vscode.window.showWarningMessage('No workspace folder is open');
                    return;
                }

                const workspaceFolder = workspaceFolders[0];
                                    const instructionsPath = vscode.Uri.joinPath(workspaceFolder!.uri, 'copilot-instructions.md');
                
                try {
                    await vscode.workspace.fs.writeFile(instructionsPath, Buffer.from(templateContent, 'utf8'));
                    
                    // Open the file
                    const document = await vscode.workspace.openTextDocument(instructionsPath);
                    await vscode.window.showTextDocument(document);
                    
                    vscode.window.showInformationMessage(`Created copilot-instructions.md from "${title}"`);
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to create copilot-instructions.md: ${error}`);
                }
            })
        );

        context.subscriptions.push(
            vscode.commands.registerCommand('copilot-prompter.openTemplateDetail', async (template: Template) => {
                const panel = vscode.window.createWebviewPanel(
                    'templateDetail',
                    `Template: ${template.title}`,
                    vscode.ViewColumn.One,
                    {
                        enableScripts: true,
                        retainContextWhenHidden: true
                    }
                );

                panel.webview.html = CommandHandlers.getTemplateDetailHtml(template);
                
                panel.webview.onDidReceiveMessage(
                    async (message) => {
                        switch (message.command) {
                            case 'copy':
                                await vscode.env.clipboard.writeText(template.content);
                                vscode.window.showInformationMessage('Template copied to clipboard');
                                break;
                            case 'createInstructions':
                                await vscode.commands.executeCommand('copilot-prompter.createCopilotInstructions', template.content, template.title);
                                break;
                        }
                    }
                );
            })
        );
    }

    private static getPromptDetailHtml(prompt: Prompt): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt.title}</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            margin: 0;
        }
        .header {
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 10px 0;
        }
        .metadata {
            display: flex;
            gap: 20px;
            font-size: 14px;
            color: var(--vscode-descriptionForeground);
        }
        .description {
            margin: 20px 0;
            padding: 15px;
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textBlockQuote-border);
        }
        .prompt-content {
            background-color: var(--vscode-textCodeBlock-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            padding: 20px;
            margin: 20px 0;
            font-family: var(--vscode-editor-font-family);
            white-space: pre-wrap;
            overflow-x: auto;
        }
        .tags {
            display: flex;
            gap: 10px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        .tag {
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
        }
        .actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .secondary-button {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        .secondary-button:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${prompt.title}</h1>
        <div class="metadata">
            <span><strong>Language:</strong> ${prompt.language}</span>
            <span><strong>Category:</strong> ${prompt.category}</span>
            <span><strong>Author:</strong> ${prompt.author}</span>
            <span><strong>Views:</strong> ${prompt.viewCount}</span>
        </div>
    </div>
    
    <div class="description">
        <strong>Description:</strong> ${prompt.description}
    </div>
    
    <div class="tags">
        ${prompt.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
    
    <div class="prompt-content">${prompt.prompt}</div>
    
    <div class="actions">
        <button onclick="copyPrompt()">📋 Copy to Clipboard</button>
        <button onclick="insertInChat()" class="secondary-button">💬 Insert in Chat</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function copyPrompt() {
            vscode.postMessage({ command: 'copy' });
        }
        
        function insertInChat() {
            vscode.postMessage({ command: 'insertChat' });
        }
    </script>
</body>
</html>`;
    }

    private static getTemplateDetailHtml(template: Template): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            margin: 0;
        }
        .header {
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .title {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 10px 0;
        }
        .metadata {
            display: flex;
            gap: 20px;
            font-size: 14px;
            color: var(--vscode-descriptionForeground);
        }
        .description {
            margin: 20px 0;
            padding: 15px;
            background-color: var(--vscode-textBlockQuote-background);
            border-left: 4px solid var(--vscode-textBlockQuote-border);
        }
        .template-content {
            background-color: var(--vscode-textCodeBlock-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            padding: 20px;
            margin: 20px 0;
            font-family: var(--vscode-editor-font-family);
            white-space: pre-wrap;
            overflow-x: auto;
            max-height: 500px;
            overflow-y: auto;
        }
        .tags {
            display: flex;
            gap: 10px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        .tag {
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
        }
        .actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .secondary-button {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        .secondary-button:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${template.title}</h1>
        <div class="metadata">
            <span><strong>Language:</strong> ${template.language}</span>
            <span><strong>Framework:</strong> ${template.framework}</span>
            <span><strong>Category:</strong> ${template.category}</span>
            <span><strong>Author:</strong> ${template.author}</span>
        </div>
    </div>
    
    <div class="description">
        <strong>Description:</strong> ${template.description}
    </div>
    
    <div class="tags">
        ${template.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
    </div>
    
    <div class="template-content">${template.content}</div>
    
    <div class="actions">
        <button onclick="copyTemplate()">📋 Copy to Clipboard</button>
        <button onclick="createInstructions()" class="secondary-button">📄 Create copilot-instructions.md</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function copyTemplate() {
            vscode.postMessage({ command: 'copy' });
        }
        
        function createInstructions() {
            vscode.postMessage({ command: 'createInstructions' });
        }
    </script>
</body>
</html>`;
    }
}
