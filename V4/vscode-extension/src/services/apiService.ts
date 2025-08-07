import * as vscode from 'vscode';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface Prompt {
    id: string;
    title: string;
    prompt: string;
    description: string;
    category: string;
    language: string;
    author: string;
    tags: string[];
    active: boolean;
    viewCount: number;
    copyCount: number;
    created_at: string;
    updated_at: string;
}

export interface Template {
    id: string;
    title: string;
    content: string;
    description: string;
    category: string;
    language: string;
    framework: string;
    author: string;
    tags: string[];
    active: boolean;
    viewCount: number;
    copyCount: number;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export class ApiService {
    private client: AxiosInstance;
    private authToken: string | null = null;

    constructor() {
        this.client = axios.create({
            timeout: 10000,
        });

        // Setup request interceptor to add auth token
        this.client.interceptors.request.use((config) => {
            if (this.authToken) {
                config.headers.Authorization = `Bearer ${this.authToken}`;
            }
            return config;
        });

        // Setup response interceptor to handle errors
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.authToken = null;
                    vscode.commands.executeCommand('setContext', 'copilot-prompter.authenticated', false);
                }
                return Promise.reject(error);
            }
        );
    }

    getBaseUrl(): string {
        const config = vscode.workspace.getConfiguration('copilot-prompter');
        const backend = config.get<string>('backend', 'node');
        
        if (backend === 'node') {
            return config.get<string>('nodeUrl', 'http://localhost:8181');
        } else {
            return config.get<string>('javaUrl', 'http://localhost:8080');
        }
    }

    private getApiUrl(endpoint: string): string {
        return `${this.getBaseUrl()}/api/${endpoint}`;
    }

    setAuthToken(token: string): void {
        this.authToken = token;
    }

    clearAuthToken(): void {
        this.authToken = null;
    }

    hasAuthToken(): boolean {
        return this.authToken !== null;
    }

    // Authentication
    async login(username: string, password: string): Promise<{ token: string; user: any }> {
        const response = await this.client.post(this.getApiUrl('auth/login'), {
            username,
            password
        });

        const backend = vscode.workspace.getConfiguration('copilot-prompter').get<string>('backend', 'node');
        
        if (backend === 'node') {
            // Node.js response format: {success: true, data: {accessToken, ...}}
            if (response.data.success && response.data.data) {
                return {
                    token: response.data.data.accessToken,
                    user: response.data.data.user || { username }
                };
            }
        } else {
            // Java response format: {accessToken, user}
            if (response.data.accessToken) {
                return {
                    token: response.data.accessToken,
                    user: response.data.user || { username }
                };
            }
        }

        throw new Error('Invalid response format');
    }

    // Prompts
    async getPrompts(): Promise<Prompt[]> {
        const response: AxiosResponse<ApiResponse<Prompt[]> | Prompt[]> = await this.client.get(this.getApiUrl('prompts'));
        
        // Handle Node.js response format
        if ('success' in response.data && response.data.success) {
            return response.data.data;
        }
        
        // Handle Java response format (direct array)
        return response.data as Prompt[];
    }

    async getPrompt(id: string): Promise<Prompt> {
        const response: AxiosResponse<ApiResponse<Prompt> | Prompt> = await this.client.get(this.getApiUrl(`prompts/${id}`));
        
        // Handle Node.js response format
        if ('success' in response.data && response.data.success) {
            return response.data.data;
        }
        
        // Handle Java response format
        return response.data as Prompt;
    }

    async searchPrompts(query: string, category?: string, limit: number = 10): Promise<Prompt[]> {
        let url = `prompts/search?q=${encodeURIComponent(query)}&limit=${limit}`;
        if (category) {
            url += `&category=${encodeURIComponent(category)}`;
        }
        
        const response: AxiosResponse<ApiResponse<Prompt[]> | Prompt[]> = await this.client.get(this.getApiUrl(url));
        
        // Handle Node.js response format
        if ('success' in response.data && response.data.success) {
            return response.data.data;
        }
        
        // Handle Java response format
        return response.data as Prompt[];
    }

    async createPrompt(prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>): Promise<Prompt> {
        const response: AxiosResponse<ApiResponse<Prompt> | Prompt> = await this.client.post(this.getApiUrl('prompts'), prompt);
        
        // Handle Node.js response format
        if ('success' in response.data && response.data.success) {
            return response.data.data;
        }
        
        // Handle Java response format
        return response.data as Prompt;
    }

    // Templates
    async getTemplates(): Promise<Template[]> {
        const response: AxiosResponse<ApiResponse<Template[]> | Template[]> = await this.client.get(this.getApiUrl('templates'));
        
        // Handle Node.js response format
        if ('success' in response.data && response.data.success) {
            return response.data.data;
        }
        
        // Handle Java response format
        return response.data as Template[];
    }

    async getTemplate(id: string): Promise<Template> {
        const response: AxiosResponse<ApiResponse<Template> | Template> = await this.client.get(this.getApiUrl(`templates/${id}`));
        
        // Handle Node.js response format
        if ('success' in response.data && response.data.success) {
            return response.data.data;
        }
        
        // Handle Java response format
        return response.data as Template;
    }

    async searchTemplates(query: string, category?: string, language?: string, framework?: string, limit: number = 10): Promise<Template[]> {
        let url = `templates/search?q=${encodeURIComponent(query)}&limit=${limit}`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (language) url += `&language=${encodeURIComponent(language)}`;
        if (framework) url += `&framework=${encodeURIComponent(framework)}`;
        
        const response: AxiosResponse<ApiResponse<Template[]> | Template[]> = await this.client.get(this.getApiUrl(url));
        
        // Handle Node.js response format
        if ('success' in response.data && response.data.success) {
            return response.data.data;
        }
        
        // Handle Java response format
        return response.data as Template[];
    }

    async createTemplate(template: Omit<Template, 'id' | 'created_at' | 'updated_at'>): Promise<Template> {
        const response: AxiosResponse<ApiResponse<Template> | Template> = await this.client.post(this.getApiUrl('templates'), template);
        
        // Handle Node.js response format
        if ('success' in response.data && response.data.success) {
            return response.data.data;
        }
        
        // Handle Java response format
        return response.data as Template;
    }

    // Health check
    async healthCheck(): Promise<boolean> {
        try {
            await this.client.get(`${this.getBaseUrl()}/health`);
            return true;
        } catch {
            return false;
        }
    }
}
