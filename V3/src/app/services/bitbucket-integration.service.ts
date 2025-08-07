import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

export interface BitbucketRepository {
  uuid: string;
  name: string;
  full_name: string;
  owner: {
    display_name: string;
    nickname: string;
    account_id: string;
    avatar?: string;
  };
  description: string;
  is_private: boolean;
  html_url: string;
  clone: {
    https: string;
    ssh: string;
  }[];
  mainbranch?: {
    name: string;
  };
  links: {
    html: {
      href: string;
    };
    clone: Array<{
      name: string;
      href: string;
    }>;
  };
}

export interface BitbucketFileContent {
  path: string;
  commit: {
    hash: string;
  };
  attributes: string[];
  type: string;
  size: number;
  mimetype?: string;
  content?: string;
  links: {
    self: {
      href: string;
    };
    meta: {
      href: string;
    };
    history: {
      href: string;
    };
  };
}

export interface BitbucketCommitResponse {
  hash: string;
  date: string;
  author: {
    raw: string;
    user: {
      display_name: string;
      account_id: string;
    };
  };
  message: string;
  summary: {
    raw: string;
    markup: string;
    html: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BitbucketIntegrationService {
  private http = inject(HttpClient);
  private readonly BITBUCKET_API_BASE = 'https://api.bitbucket.org/2.0';
  private readonly STORAGE_KEY = 'bitbucket_access_token';
  private readonly USERNAME_KEY = 'bitbucket_username';

  private get headers(): HttpHeaders {
    const token = this.getAccessToken();
    const username = this.getUsername();
    
    if (token && username) {
      // Bitbucket uses Basic Auth with username:app_password
      const credentials = btoa(`${username}:${token}`);
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`
      });
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  /**
   * Store Bitbucket credentials (username and app password)
   */
  setCredentials(username: string, appPassword: string): void {
    localStorage.setItem(this.USERNAME_KEY, username);
    localStorage.setItem(this.STORAGE_KEY, appPassword);
  }

  /**
   * Get stored Bitbucket app password
   */
  getAccessToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * Get stored Bitbucket username
   */
  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  /**
   * Clear stored Bitbucket credentials
   */
  clearCredentials(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
  }

  /**
   * Check if user is authenticated with Bitbucket
   */
  isAuthenticated(): boolean {
    return !!(this.getAccessToken() && this.getUsername());
  }

  /**
   * Get user's repositories
   */
  getUserRepositories(): Observable<BitbucketRepository[]> {
    const username = this.getUsername();
    if (!username) {
      return throwError(() => new Error('Username not found'));
    }

    return this.http.get<{ values: BitbucketRepository[] }>(`${this.BITBUCKET_API_BASE}/repositories/${username}`, {
      headers: this.headers,
      params: {
        sort: '-updated_on',
        pagelen: '100'
      }
    }).pipe(
      map(response => response.values),
      tap(repos => console.log('Fetched Bitbucket repositories:', repos.length)),
      catchError(this.handleError<BitbucketRepository[]>('getUserRepositories', []))
    );
  }

  /**
   * Get team/workspace repositories
   */
  getWorkspaceRepositories(workspace: string): Observable<BitbucketRepository[]> {
    return this.http.get<{ values: BitbucketRepository[] }>(`${this.BITBUCKET_API_BASE}/repositories/${workspace}`, {
      headers: this.headers,
      params: {
        sort: '-updated_on',
        pagelen: '100'
      }
    }).pipe(
      map(response => response.values),
      tap(repos => console.log(`Fetched ${workspace} repositories:`, repos.length)),
      catchError(this.handleError<BitbucketRepository[]>('getWorkspaceRepositories', []))
    );
  }

  /**
   * Check if copilot-instructions.md exists in repository
   */
  checkCopilotInstructions(workspace: string, repo: string): Observable<BitbucketFileContent | null> {
    return this.http.get<BitbucketFileContent>(`${this.BITBUCKET_API_BASE}/repositories/${workspace}/${repo}/src/main/.github/copilot-instructions.md`, {
      headers: this.headers
    }).pipe(
      tap(file => console.log('Found existing copilot-instructions.md in Bitbucket')),
      catchError(error => {
        if (error.status === 404) {
          return of(null);
        }
        return this.handleError<BitbucketFileContent | null>('checkCopilotInstructions')(error);
      })
    );
  }

  /**
   * Get file content from repository
   */
  getFileContent(workspace: string, repo: string, path: string, branch: string = 'main'): Observable<string> {
    return this.http.get(`${this.BITBUCKET_API_BASE}/repositories/${workspace}/${repo}/src/${branch}/${path}`, {
      headers: this.headers,
      responseType: 'text'
    }).pipe(
      tap(content => console.log(`Retrieved file content: ${path}`)),
      catchError(this.handleError<string>('getFileContent', ''))
    );
  }

  /**
   * Create or update copilot-instructions.md file in repository
   */
  createOrUpdateCopilotInstructions(
    workspace: string, 
    repo: string, 
    content: string, 
    message: string = 'Add/Update copilot-instructions.md via Copilot Prompter',
    branch: string = 'main'
  ): Observable<BitbucketCommitResponse> {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('branch', branch);
    formData.append('.github/copilot-instructions.md', content);

    // Bitbucket uses multipart/form-data for file uploads
    const headers = new HttpHeaders({
      'Authorization': this.headers.get('Authorization') || ''
    });

    return this.http.post<BitbucketCommitResponse>(
      `${this.BITBUCKET_API_BASE}/repositories/${workspace}/${repo}/src`,
      formData,
      { headers }
    ).pipe(
      tap(response => console.log('Created/Updated copilot-instructions.md in Bitbucket:', response)),
      catchError(this.handleError<BitbucketCommitResponse>('createOrUpdateCopilotInstructions'))
    );
  }

  /**
   * Create a new branch for copilot instructions
   */
  createBranch(workspace: string, repo: string, branchName: string, baseBranch: string = 'main'): Observable<any> {
    return this.http.post(`${this.BITBUCKET_API_BASE}/repositories/${workspace}/${repo}/refs/branches`, {
      name: branchName,
      target: {
        hash: baseBranch
      }
    }, { headers: this.headers }).pipe(
      tap(response => console.log('Created Bitbucket branch:', branchName)),
      catchError(this.handleError<any>('createBranch'))
    );
  }

  /**
   * Create a pull request
   */
  createPullRequest(
    workspace: string, 
    repo: string, 
    title: string, 
    description: string, 
    sourceBranch: string, 
    destinationBranch: string = 'main'
  ): Observable<any> {
    return this.http.post(`${this.BITBUCKET_API_BASE}/repositories/${workspace}/${repo}/pullrequests`, {
      title,
      description,
      source: {
        branch: {
          name: sourceBranch
        }
      },
      destination: {
        branch: {
          name: destinationBranch
        }
      }
    }, { headers: this.headers }).pipe(
      tap(response => console.log('Created Bitbucket pull request:', response)),
      catchError(this.handleError<any>('createPullRequest'))
    );
  }

  /**
   * Get repository contents (for exploring file structure)
   */
  getRepositoryContents(workspace: string, repo: string, path: string = '', branch: string = 'main'): Observable<BitbucketFileContent[]> {
    return this.http.get<{ values: BitbucketFileContent[] }>(`${this.BITBUCKET_API_BASE}/repositories/${workspace}/${repo}/src/${branch}/${path}`, {
      headers: this.headers,
      params: {
        pagelen: '100'
      }
    }).pipe(
      map(response => response.values || []),
      tap(contents => console.log(`Bitbucket repository contents for ${path}:`, contents.length)),
      catchError(this.handleError<BitbucketFileContent[]>('getRepositoryContents', []))
    );
  }

  /**
   * Analyze repository for technology stack
   */
  analyzeRepositoryTechStack(workspace: string, repo: string): Observable<string[]> {
    // Bitbucket doesn't have a direct languages API like GitHub
    // We'll analyze by getting the repository contents and detecting file extensions
    return this.getRepositoryContents(workspace, repo).pipe(
      map(contents => this.detectLanguagesFromFiles(contents)),
      tap(langs => console.log('Detected languages from Bitbucket repo:', langs)),
      catchError(this.handleError<string[]>('analyzeRepositoryTechStack', []))
    );
  }

  /**
   * Get Bitbucket user information
   */
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.BITBUCKET_API_BASE}/user`, {
      headers: this.headers
    }).pipe(
      tap(user => console.log('Bitbucket user info:', user)),
      catchError(this.handleError<any>('getUserInfo'))
    );
  }

  /**
   * Get workspaces (teams) the user has access to
   */
  getUserWorkspaces(): Observable<any[]> {
    return this.http.get<{ values: any[] }>(`${this.BITBUCKET_API_BASE}/workspaces`, {
      headers: this.headers,
      params: {
        role: 'member',
        pagelen: '100'
      }
    }).pipe(
      map(response => response.values),
      tap(workspaces => console.log('Bitbucket workspaces:', workspaces.length)),
      catchError(this.handleError<any[]>('getUserWorkspaces', []))
    );
  }

  private detectLanguagesFromFiles(files: BitbucketFileContent[]): string[] {
    const extensionMap: { [key: string]: string } = {
      '.js': 'JavaScript',
      '.ts': 'TypeScript',
      '.py': 'Python',
      '.java': 'Java',
      '.cs': 'C#',
      '.cpp': 'C++',
      '.c': 'C',
      '.php': 'PHP',
      '.rb': 'Ruby',
      '.go': 'Go',
      '.rs': 'Rust',
      '.swift': 'Swift',
      '.kt': 'Kotlin',
      '.scala': 'Scala',
      '.html': 'HTML',
      '.css': 'CSS',
      '.scss': 'SCSS',
      '.less': 'Less',
      '.vue': 'Vue',
      '.jsx': 'JSX',
      '.tsx': 'TSX',
      '.json': 'JSON',
      '.xml': 'XML',
      '.yml': 'YAML',
      '.yaml': 'YAML',
      '.sql': 'SQL',
      '.sh': 'Shell',
      '.dockerfile': 'Docker',
      '.tf': 'Terraform'
    };

    const detectedLanguages = new Set<string>();
    
    files.forEach(file => {
      if (file.type === 'commit_file') {
        const extension = file.path.substring(file.path.lastIndexOf('.'));
        const language = extensionMap[extension.toLowerCase()];
        if (language) {
          detectedLanguages.add(language);
        }
      }
    });

    return Array.from(detectedLanguages);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`Bitbucket ${operation} failed:`, error);
      
      // Handle specific Bitbucket API errors
      if (error.status === 401) {
        console.error('Bitbucket authentication failed. Please check your credentials.');
        this.clearCredentials();
      } else if (error.status === 403) {
        console.error('Bitbucket API access forbidden. Check permissions.');
      } else if (error.status === 404) {
        console.error('Bitbucket resource not found.');
      }

      return throwError(() => error);
    };
  }
}
