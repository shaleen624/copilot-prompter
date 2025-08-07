import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
  private: boolean;
  html_url: string;
  clone_url: string;
  default_branch: string;
}

export interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content?: string;
  encoding?: string;
}

export interface GitHubCommitResponse {
  content: GitHubFileContent;
  commit: {
    sha: string;
    url: string;
    message: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GitHubIntegrationService {
  private http = inject(HttpClient);
  private readonly GITHUB_API_BASE = 'https://api.github.com';
  private readonly STORAGE_KEY = 'github_access_token';

  private get headers(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  /**
   * Store GitHub personal access token
   */
  setAccessToken(token: string): void {
    localStorage.setItem(this.STORAGE_KEY, token);
  }

  /**
   * Get stored GitHub access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * Clear stored GitHub access token
   */
  clearAccessToken(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Check if user is authenticated with GitHub
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Get user's repositories
   */
  getUserRepositories(): Observable<GitHubRepository[]> {
    return this.http.get<GitHubRepository[]>(`${this.GITHUB_API_BASE}/user/repos`, {
      headers: this.headers,
      params: {
        sort: 'updated',
        per_page: '100'
      }
    }).pipe(
      tap(repos => console.log('Fetched user repositories:', repos.length)),
      catchError(this.handleError<GitHubRepository[]>('getUserRepositories', []))
    );
  }

  /**
   * Get organization repositories
   */
  getOrgRepositories(org: string): Observable<GitHubRepository[]> {
    return this.http.get<GitHubRepository[]>(`${this.GITHUB_API_BASE}/orgs/${org}/repos`, {
      headers: this.headers,
      params: {
        sort: 'updated',
        per_page: '100'
      }
    }).pipe(
      tap(repos => console.log(`Fetched ${org} repositories:`, repos.length)),
      catchError(this.handleError<GitHubRepository[]>('getOrgRepositories', []))
    );
  }

  /**
   * Check if copilot-instructions.md exists in repository
   */
  checkCopilotInstructions(owner: string, repo: string): Observable<GitHubFileContent | null> {
    return this.http.get<GitHubFileContent>(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/contents/.github/copilot-instructions.md`, {
      headers: this.headers
    }).pipe(
      tap(file => console.log('Found existing copilot-instructions.md')),
      catchError(error => {
        if (error.status === 404) {
          return of(null);
        }
        return this.handleError<GitHubFileContent | null>('checkCopilotInstructions')(error);
      })
    );
  }

  /**
   * Create or update copilot-instructions.md file in repository
   */
  createOrUpdateCopilotInstructions(
    owner: string, 
    repo: string, 
    content: string, 
    message: string = 'Add/Update copilot-instructions.md via Copilot Prompter',
    sha?: string
  ): Observable<GitHubCommitResponse> {
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    
    const body: any = {
      message,
      content: encodedContent,
      branch: 'main' // You might want to make this configurable
    };

    if (sha) {
      body.sha = sha; // Required for updates
    }

    return this.http.put<GitHubCommitResponse>(
      `${this.GITHUB_API_BASE}/repos/${owner}/${repo}/contents/.github/copilot-instructions.md`,
      body,
      { headers: this.headers }
    ).pipe(
      tap(response => console.log('Created/Updated copilot-instructions.md:', response)),
      catchError(this.handleError<GitHubCommitResponse>('createOrUpdateCopilotInstructions'))
    );
  }

  /**
   * Create a new branch for copilot instructions
   */
  createBranch(owner: string, repo: string, branchName: string, baseBranch: string = 'main'): Observable<any> {
    // First, get the SHA of the base branch
    return this.http.get(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs/heads/${baseBranch}`, {
      headers: this.headers
    }).pipe(
      map((response: any) => response.object.sha),
      tap((sha: string) => console.log(`Base branch ${baseBranch} SHA:`, sha)),
      // Then create the new branch
      switchMap((sha: string) => 
        this.http.post(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs`, {
          ref: `refs/heads/${branchName}`,
          sha: sha
        }, { headers: this.headers })
      ),
      tap(response => console.log('Created branch:', branchName)),
      catchError(this.handleError<any>('createBranch'))
    );
  }

  /**
   * Create a pull request
   */
  createPullRequest(
    owner: string, 
    repo: string, 
    title: string, 
    body: string, 
    head: string, 
    base: string = 'main'
  ): Observable<any> {
    return this.http.post(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/pulls`, {
      title,
      body,
      head,
      base
    }, { headers: this.headers }).pipe(
      tap(response => console.log('Created pull request:', response)),
      catchError(this.handleError<any>('createPullRequest'))
    );
  }

  /**
   * Get repository contents (for exploring file structure)
   */
  getRepositoryContents(owner: string, repo: string, path: string = ''): Observable<GitHubFileContent[]> {
    return this.http.get<GitHubFileContent[]>(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`, {
      headers: this.headers
    }).pipe(
      tap(contents => console.log(`Repository contents for ${path}:`, contents.length)),
      catchError(this.handleError<GitHubFileContent[]>('getRepositoryContents', []))
    );
  }

  /**
   * Analyze repository for technology stack
   */
  analyzeRepositoryTechStack(owner: string, repo: string): Observable<string[]> {
    return this.http.get(`${this.GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, {
      headers: this.headers
    }).pipe(
      map((languages: any) => Object.keys(languages)),
      tap(langs => console.log('Detected languages:', langs)),
      catchError(this.handleError<string[]>('analyzeRepositoryTechStack', []))
    );
  }

  /**
   * Get GitHub user information
   */
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.GITHUB_API_BASE}/user`, {
      headers: this.headers
    }).pipe(
      tap(user => console.log('GitHub user info:', user)),
      catchError(this.handleError<any>('getUserInfo'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      
      // Handle specific GitHub API errors
      if (error.status === 401) {
        console.error('GitHub authentication failed. Please check your access token.');
        this.clearAccessToken();
      } else if (error.status === 403) {
        console.error('GitHub API rate limit exceeded or insufficient permissions.');
      } else if (error.status === 404) {
        console.error('GitHub resource not found.');
      }

      return throwError(() => error);
    };
  }
}
