import * as vscode from 'vscode';
import { ApiService } from './apiService';

interface StoredAuth {
    token: string;
    user: any;
    backend: string;
    timestamp: number;
}

export class AuthService {
    private readonly TOKEN_KEY = 'copilot-prompter.auth';
    private readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
    private authChangeEmitter = new vscode.EventEmitter<boolean>();

    constructor(
        private context: vscode.ExtensionContext,
        private apiService: ApiService
    ) {
        this.loadStoredAuth();
    }

    public readonly onAuthenticationChanged = this.authChangeEmitter.event;

    private loadStoredAuth(): void {
        try {
            const stored = this.context.globalState.get<StoredAuth>(this.TOKEN_KEY);
            if (stored && this.isTokenValid(stored)) {
                this.apiService.setAuthToken(stored.token);
                this.notifyAuthChange(true);
            } else {
                this.clearStoredAuth();
            }
        } catch (error) {
            console.error('Failed to load stored auth:', error);
            this.clearStoredAuth();
        }
    }

    private isTokenValid(auth: StoredAuth): boolean {
        const now = Date.now();
        const isExpired = (now - auth.timestamp) > this.TOKEN_EXPIRY;
        const isSameBackend = auth.backend === vscode.workspace.getConfiguration('copilot-prompter').get<string>('backend');
        
        return !isExpired && isSameBackend;
    }

    private async storeAuth(token: string, user: any): Promise<void> {
        const auth: StoredAuth = {
            token,
            user,
            backend: vscode.workspace.getConfiguration('copilot-prompter').get<string>('backend', 'node'),
            timestamp: Date.now()
        };

        await this.context.globalState.update(this.TOKEN_KEY, auth);
    }

    private async clearStoredAuth(): Promise<void> {
        await this.context.globalState.update(this.TOKEN_KEY, undefined);
        this.apiService.clearAuthToken();
        this.notifyAuthChange(false);
    }

    private notifyAuthChange(authenticated: boolean): void {
        vscode.commands.executeCommand('setContext', 'copilot-prompter.authenticated', authenticated);
        this.authChangeEmitter.fire(authenticated);
    }

    async authenticate(): Promise<boolean> {
        try {
            // Check if already authenticated and valid
            if (this.isAuthenticated() && await this.validateCurrentAuth()) {
                vscode.window.showInformationMessage('Already authenticated!');
                return true;
            }

            // Get credentials from user
            const credentials = await this.getCredentialsFromUser();
            if (!credentials) {
                return false;
            }

            // Show progress
            return await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Authenticating with Copilot Prompter...',
                cancellable: false
            }, async (progress) => {
                try {
                    progress.report({ increment: 50, message: 'Logging in...' });
                    
                    const result = await this.apiService.login(credentials.username, credentials.password);
                    
                    progress.report({ increment: 50, message: 'Storing credentials...' });
                    
                    await this.storeAuth(result.token, result.user);
                    this.apiService.setAuthToken(result.token);
                    this.notifyAuthChange(true);
                    
                    vscode.window.showInformationMessage(`Welcome, ${result.user.username || credentials.username}!`);
                    return true;
                } catch (error: any) {
                    vscode.window.showErrorMessage(`Authentication failed: ${error.message}`);
                    return false;
                }
            });
        } catch (error: any) {
            vscode.window.showErrorMessage(`Authentication error: ${error.message}`);
            return false;
        }
    }

    private async getCredentialsFromUser(): Promise<{ username: string; password: string } | null> {
        // Show quick pick for demo credentials or custom login
        const choice = await vscode.window.showQuickPick([
            {
                label: '$(person) Demo User (Node.js)',
                description: 'demo / Demo1234',
                detail: 'Quick login with demo credentials for Node.js backend',
                credentials: { username: 'demo', password: 'Demo1234' }
            },
            {
                label: '$(shield) Admin (Java)',
                description: 'admin / admin123',
                detail: 'Quick login with admin credentials for Java backend',
                credentials: { username: 'admin', password: 'admin123' }
            },
            {
                label: '$(key) Custom Login',
                description: 'Enter your own credentials',
                detail: 'Manually enter username and password'
            }
        ], {
            placeHolder: 'Choose authentication method',
            title: 'Copilot Prompter Authentication'
        });

        if (!choice) {
            return null;
        }

        if ('credentials' in choice) {
            return choice.credentials || null;
        }

        // Custom login flow
        const username = await vscode.window.showInputBox({
            prompt: 'Enter your username',
            placeHolder: 'Username',
            ignoreFocusOut: true
        });

        if (!username) {
            return null;
        }

        const password = await vscode.window.showInputBox({
            prompt: 'Enter your password',
            placeHolder: 'Password',
            password: true,
            ignoreFocusOut: true
        });

        if (!password) {
            return null;
        }

        return { username, password };
    }

    private async validateCurrentAuth(): Promise<boolean> {
        try {
            // Try to make a simple API call to validate the token
            await this.apiService.getPrompts();
            return true;
        } catch {
            await this.clearStoredAuth();
            return false;
        }
    }

    isAuthenticated(): boolean {
        return this.apiService.hasAuthToken();
    }

    async logout(): Promise<void> {
        await this.clearStoredAuth();
        vscode.window.showInformationMessage('Logged out successfully');
    }

    getCurrentUser(): any {
        const stored = this.context.globalState.get<StoredAuth>(this.TOKEN_KEY);
        return stored?.user;
    }

    // Check if backend changed and re-authenticate if needed
    async onBackendChanged(): Promise<void> {
        const stored = this.context.globalState.get<StoredAuth>(this.TOKEN_KEY);
        const currentBackend = vscode.workspace.getConfiguration('copilot-prompter').get<string>('backend');
        
        if (stored && stored.backend !== currentBackend) {
            await this.clearStoredAuth();
            vscode.window.showWarningMessage(
                'Backend changed. Please authenticate again.',
                'Authenticate'
            ).then(choice => {
                if (choice === 'Authenticate') {
                    this.authenticate();
                }
            });
        }
    }
}
