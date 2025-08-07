import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { GitHubIntegrationService, GitHubRepository } from './github-integration.service';
import { BitbucketIntegrationService, BitbucketRepository } from './bitbucket-integration.service';

export type SourceControlProvider = 'github' | 'bitbucket';

export interface UnifiedRepository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  isPrivate: boolean;
  htmlUrl: string;
  cloneUrl: string;
  defaultBranch: string;
  owner: {
    name: string;
    avatar?: string;
  };
  provider: SourceControlProvider;
  rawData: GitHubRepository | BitbucketRepository;
}

export interface UnifiedFileContent {
  path: string;
  content?: string;
  sha?: string;
  size: number;
  provider: SourceControlProvider;
}

export interface UnifiedCommitResponse {
  hash: string;
  message: string;
  provider: SourceControlProvider;
}

@Injectable({
  providedIn: 'root'
})
export class SourceControlService {
  private githubService = inject(GitHubIntegrationService);
  private bitbucketService = inject(BitbucketIntegrationService);

  /**
   * Get the current active provider based on authentication status
   */
  getActiveProvider(): SourceControlProvider | null {
    if (this.githubService.isAuthenticated()) return 'github';
    if (this.bitbucketService.isAuthenticated()) return 'bitbucket';
    return null;
  }

  /**
   * Get available providers (those that are authenticated)
   */
  getAvailableProviders(): SourceControlProvider[] {
    const providers: SourceControlProvider[] = [];
    if (this.githubService.isAuthenticated()) providers.push('github');
    if (this.bitbucketService.isAuthenticated()) providers.push('bitbucket');
    return providers;
  }

  /**
   * Check if any provider is authenticated
   */
  isAuthenticated(): boolean {
    return this.githubService.isAuthenticated() || this.bitbucketService.isAuthenticated();
  }

  /**
   * Get repositories from all authenticated providers
   */
  getAllRepositories(): Observable<UnifiedRepository[]> {
    const allRepos: Observable<UnifiedRepository[]>[] = [];

    if (this.githubService.isAuthenticated()) {
      allRepos.push(
        this.githubService.getUserRepositories().pipe(
          map(repos => repos.map(repo => this.convertGitHubRepo(repo)))
        )
      );
    }

    if (this.bitbucketService.isAuthenticated()) {
      allRepos.push(
        this.bitbucketService.getUserRepositories().pipe(
          map(repos => repos.map(repo => this.convertBitbucketRepo(repo)))
        )
      );
    }

    if (allRepos.length === 0) {
      return of([]);
    }

    // Combine all repository streams
    return new Observable<UnifiedRepository[]>(subscriber => {
      const results: UnifiedRepository[][] = [];
      let completed = 0;

      allRepos.forEach((repoStream, index) => {
        repoStream.subscribe({
          next: (repos) => {
            results[index] = repos;
          },
          error: (error) => {
            console.error('Error fetching repositories:', error);
            results[index] = [];
          },
          complete: () => {
            completed++;
            if (completed === allRepos.length) {
              const combined = results.flat();
              subscriber.next(combined);
              subscriber.complete();
            }
          }
        });
      });
    });
  }

  /**
   * Get repositories from a specific provider
   */
  getRepositories(provider: SourceControlProvider): Observable<UnifiedRepository[]> {
    switch (provider) {
      case 'github':
        return this.githubService.getUserRepositories().pipe(
          map(repos => repos.map(repo => this.convertGitHubRepo(repo)))
        );
      case 'bitbucket':
        return this.bitbucketService.getUserRepositories().pipe(
          map(repos => repos.map(repo => this.convertBitbucketRepo(repo)))
        );
      default:
        return of([]);
    }
  }

  /**
   * Check if copilot instructions exist in a repository
   */
  checkCopilotInstructions(repo: UnifiedRepository): Observable<UnifiedFileContent | null> {
    const [owner, repoName] = repo.fullName.split('/');

    switch (repo.provider) {
      case 'github':
        return this.githubService.checkCopilotInstructions(owner, repoName).pipe(
          map(file => file ? {
            path: file.path,
            content: file.content ? atob(file.content) : undefined,
            sha: file.sha,
            size: file.size,
            provider: 'github' as SourceControlProvider
          } : null)
        );
      case 'bitbucket':
        return this.bitbucketService.checkCopilotInstructions(owner, repoName).pipe(
          map(file => file ? {
            path: file.path,
            size: file.size,
            provider: 'bitbucket' as SourceControlProvider
          } : null)
        );
      default:
        return of(null);
    }
  }

  /**
   * Create or update copilot instructions in a repository
   */
  createOrUpdateCopilotInstructions(
    repo: UnifiedRepository,
    content: string,
    message?: string,
    existingFile?: UnifiedFileContent
  ): Observable<UnifiedCommitResponse> {
    const [owner, repoName] = repo.fullName.split('/');

    switch (repo.provider) {
      case 'github':
        return this.githubService.createOrUpdateCopilotInstructions(
          owner,
          repoName,
          content,
          message,
          existingFile?.sha
        ).pipe(
          map(response => ({
            hash: response.commit.sha,
            message: response.commit.message,
            provider: 'github' as SourceControlProvider
          }))
        );
      case 'bitbucket':
        return this.bitbucketService.createOrUpdateCopilotInstructions(
          owner,
          repoName,
          content,
          message
        ).pipe(
          map(response => ({
            hash: response.hash,
            message: response.message,
            provider: 'bitbucket' as SourceControlProvider
          }))
        );
      default:
        throw new Error(`Unsupported provider: ${repo.provider}`);
    }
  }

  /**
   * Analyze repository technology stack
   */
  analyzeRepositoryTechStack(repo: UnifiedRepository): Observable<string[]> {
    const [owner, repoName] = repo.fullName.split('/');

    switch (repo.provider) {
      case 'github':
        return this.githubService.analyzeRepositoryTechStack(owner, repoName);
      case 'bitbucket':
        return this.bitbucketService.analyzeRepositoryTechStack(owner, repoName);
      default:
        return of([]);
    }
  }

  /**
   * Create a branch in a repository
   */
  createBranch(
    repo: UnifiedRepository,
    branchName: string,
    baseBranch?: string
  ): Observable<any> {
    const [owner, repoName] = repo.fullName.split('/');

    switch (repo.provider) {
      case 'github':
        return this.githubService.createBranch(owner, repoName, branchName, baseBranch);
      case 'bitbucket':
        return this.bitbucketService.createBranch(owner, repoName, branchName, baseBranch);
      default:
        throw new Error(`Unsupported provider: ${repo.provider}`);
    }
  }

  /**
   * Create a pull request in a repository
   */
  createPullRequest(
    repo: UnifiedRepository,
    title: string,
    body: string,
    sourceBranch: string,
    targetBranch?: string
  ): Observable<any> {
    const [owner, repoName] = repo.fullName.split('/');

    switch (repo.provider) {
      case 'github':
        return this.githubService.createPullRequest(owner, repoName, title, body, sourceBranch, targetBranch);
      case 'bitbucket':
        return this.bitbucketService.createPullRequest(owner, repoName, title, body, sourceBranch, targetBranch);
      default:
        throw new Error(`Unsupported provider: ${repo.provider}`);
    }
  }

  /**
   * Get authentication service for a specific provider
   */
  getAuthService(provider: SourceControlProvider): GitHubIntegrationService | BitbucketIntegrationService {
    switch (provider) {
      case 'github':
        return this.githubService;
      case 'bitbucket':
        return this.bitbucketService;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private convertGitHubRepo(repo: GitHubRepository): UnifiedRepository {
    return {
      id: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || '',
      isPrivate: repo.private,
      htmlUrl: repo.html_url,
      cloneUrl: repo.clone_url,
      defaultBranch: repo.default_branch,
      owner: {
        name: repo.owner.login,
        avatar: repo.owner.avatar_url
      },
      provider: 'github',
      rawData: repo
    };
  }

  private convertBitbucketRepo(repo: BitbucketRepository): UnifiedRepository {
    const httpsClone = repo.links.clone.find(link => link.name === 'https');
    
    return {
      id: repo.uuid,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || '',
      isPrivate: repo.is_private,
      htmlUrl: repo.links.html.href,
      cloneUrl: httpsClone?.href || '',
      defaultBranch: repo.mainbranch?.name || 'main',
      owner: {
        name: repo.owner.display_name || repo.owner.nickname,
        avatar: repo.owner.avatar
      },
      provider: 'bitbucket',
      rawData: repo
    };
  }
}
