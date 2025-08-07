import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface GitHubCopilotMetrics {
  repository: string;
  totalLines: number;
  copilotAcceptanceRate: number;
  suggestionsPerDay: number;
  languageDistribution: { [key: string]: number };
  topFiles: string[];
  lastActivity: Date;
}

export interface CopilotUsageAnalytics {
  dailyAcceptance: { date: string; rate: number }[];
  languagePreferences: { language: string; usage: number }[];
  productivityGains: {
    linesPerHour: number;
    timesSaved: number;
    bugsReduced: number;
  };
}

export interface RepositoryAnalysis {
  techStack: string[];
  complexity: 'simple' | 'medium' | 'complex';
  recommendedTemplates: string[];
  codeQualityScore: number;
  securityIssues: string[];
  performanceInsights: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CopilotAnalyticsService {
  private http = inject(HttpClient);

  /**
   * Analyze repository structure and suggest optimal templates
   */
  analyzeRepository(owner: string, repo: string): Observable<RepositoryAnalysis> {
    // This would typically call GitHub API and analyze the repository
    // For demo purposes, we'll simulate analysis based on common patterns
    
    return this.http.get(`https://api.github.com/repos/${owner}/${repo}/languages`).pipe(
      map((languages: any) => {
        const techStack = Object.keys(languages);
        const analysis: RepositoryAnalysis = {
          techStack,
          complexity: this.determineComplexity(languages),
          recommendedTemplates: this.getRecommendedTemplates(techStack),
          codeQualityScore: this.calculateQualityScore(languages),
          securityIssues: this.identifySecurityConcerns(techStack),
          performanceInsights: this.getPerformanceInsights(techStack)
        };
        return analysis;
      }),
      catchError(error => {
        console.error('Repository analysis failed:', error);
        return of({
          techStack: [],
          complexity: 'medium' as const,
          recommendedTemplates: [],
          codeQualityScore: 0,
          securityIssues: [],
          performanceInsights: []
        });
      })
    );
  }

  /**
   * Get Copilot usage metrics for a repository
   */
  getCopilotMetrics(owner: string, repo: string): Observable<GitHubCopilotMetrics> {
    // Simulated data - in real implementation, this would come from GitHub Copilot API
    const mockMetrics: GitHubCopilotMetrics = {
      repository: `${owner}/${repo}`,
      totalLines: Math.floor(Math.random() * 50000) + 10000,
      copilotAcceptanceRate: Math.floor(Math.random() * 40) + 60, // 60-100%
      suggestionsPerDay: Math.floor(Math.random() * 200) + 50,
      languageDistribution: {
        'TypeScript': 45,
        'JavaScript': 30,
        'HTML': 15,
        'CSS': 10
      },
      topFiles: [
        'src/app/app.component.ts',
        'src/app/services/api.service.ts',
        'src/app/components/main.component.ts'
      ],
      lastActivity: new Date()
    };

    return of(mockMetrics).pipe(
      tap(metrics => console.log('Copilot metrics:', metrics))
    );
  }

  /**
   * Get detailed usage analytics
   */
  getUsageAnalytics(owner: string, repo: string): Observable<CopilotUsageAnalytics> {
    // Generate mock analytics data
    const dailyAcceptance = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      rate: Math.floor(Math.random() * 40) + 60
    }));

    const mockAnalytics: CopilotUsageAnalytics = {
      dailyAcceptance,
      languagePreferences: [
        { language: 'TypeScript', usage: 85 },
        { language: 'JavaScript', usage: 78 },
        { language: 'Python', usage: 72 },
        { language: 'HTML', usage: 65 }
      ],
      productivityGains: {
        linesPerHour: Math.floor(Math.random() * 50) + 100,
        timesSaved: Math.floor(Math.random() * 8) + 2, // hours per day
        bugsReduced: Math.floor(Math.random() * 30) + 15 // percentage
      }
    };

    return of(mockAnalytics);
  }

  /**
   * Generate personalized copilot instructions based on repository analysis
   */
  generatePersonalizedInstructions(analysis: RepositoryAnalysis): string {
    let instructions = '# Personalized Copilot Instructions\n\n';
    instructions += '## Project Context\n';
    instructions += `This is a ${analysis.complexity} project using: ${analysis.techStack.join(', ')}\n\n`;

    instructions += '## Coding Standards\n';
    
    // Add language-specific standards
    if (analysis.techStack.includes('TypeScript')) {
      instructions += '- Use TypeScript strict mode for type safety\n';
      instructions += '- Prefer interfaces over types for object definitions\n';
      instructions += '- Use async/await instead of Promises.then()\n';
    }

    if (analysis.techStack.includes('React')) {
      instructions += '- Use functional components with hooks\n';
      instructions += '- Implement proper error boundaries\n';
      instructions += '- Use React.memo for performance optimization\n';
    }

    if (analysis.techStack.includes('Angular')) {
      instructions += '- Use standalone components when possible\n';
      instructions += '- Implement OnPush change detection strategy\n';
      instructions += '- Use signals for reactive programming\n';
    }

    // Add security guidelines based on identified issues
    if (analysis.securityIssues.length > 0) {
      instructions += '\n## Security Guidelines\n';
      analysis.securityIssues.forEach(issue => {
        instructions += `- ${issue}\n`;
      });
    }

    // Add performance insights
    if (analysis.performanceInsights.length > 0) {
      instructions += '\n## Performance Guidelines\n';
      analysis.performanceInsights.forEach(insight => {
        instructions += `- ${insight}\n`;
      });
    }

    return instructions;
  }

  private determineComplexity(languages: any): 'simple' | 'medium' | 'complex' {
    const languageCount = Object.keys(languages).length;
    const totalBytes = Object.values(languages).reduce((sum: number, bytes) => sum + (bytes as number), 0);

    if (languageCount <= 2 && totalBytes < 50000) return 'simple';
    if (languageCount <= 4 && totalBytes < 200000) return 'medium';
    return 'complex';
  }

  private getRecommendedTemplates(techStack: string[]): string[] {
    const templates: string[] = [];

    if (techStack.includes('TypeScript')) {
      templates.push('TypeScript Best Practices');
    }
    if (techStack.includes('JavaScript')) {
      templates.push('JavaScript ES6+ Guidelines');
    }
    if (techStack.includes('Python')) {
      templates.push('Python PEP 8 Standards');
    }
    if (techStack.includes('React') || techStack.includes('JSX')) {
      templates.push('React Development Guidelines');
    }
    if (techStack.includes('Angular') || techStack.includes('TypeScript')) {
      templates.push('Angular Best Practices');
    }
    if (techStack.includes('Node.js') || (techStack.includes('JavaScript') && techStack.includes('JSON'))) {
      templates.push('Node.js API Development');
    }

    return templates;
  }

  private calculateQualityScore(languages: any): number {
    // Simple heuristic based on language choices and distribution
    const modernLanguages = ['TypeScript', 'Rust', 'Go', 'Swift', 'Kotlin'];
    const totalBytes = Object.values(languages).reduce((sum: number, bytes) => sum + (bytes as number), 0);
    
    let score = 70; // Base score

    // Bonus for modern languages
    Object.keys(languages).forEach(lang => {
      if (modernLanguages.includes(lang)) {
        const percentage = (languages[lang] / totalBytes) * 100;
        score += percentage * 0.3;
      }
    });

    // Bonus for TypeScript usage
    if (languages['TypeScript']) {
      const tsPercentage = (languages['TypeScript'] / totalBytes) * 100;
      score += tsPercentage * 0.2;
    }

    return Math.min(100, Math.round(score));
  }

  private identifySecurityConcerns(techStack: string[]): string[] {
    const concerns: string[] = [];

    if (techStack.includes('JavaScript') || techStack.includes('TypeScript')) {
      concerns.push('Sanitize all user inputs to prevent XSS attacks');
      concerns.push('Use environment variables for sensitive configuration');
      concerns.push('Implement proper CORS policies');
    }

    if (techStack.includes('Python')) {
      concerns.push('Use parameterized queries to prevent SQL injection');
      concerns.push('Validate all input data with strict schemas');
    }

    if (techStack.includes('Java')) {
      concerns.push('Keep dependencies updated to avoid known vulnerabilities');
      concerns.push('Use HTTPS for all external communications');
    }

    return concerns;
  }

  private getPerformanceInsights(techStack: string[]): string[] {
    const insights: string[] = [];

    if (techStack.includes('React')) {
      insights.push('Use React.lazy() for code splitting');
      insights.push('Implement virtual scrolling for long lists');
      insights.push('Optimize re-renders with useMemo and useCallback');
    }

    if (techStack.includes('Angular')) {
      insights.push('Use OnPush change detection strategy');
      insights.push('Implement lazy loading for routes');
      insights.push('Use trackBy functions in *ngFor loops');
    }

    if (techStack.includes('JavaScript') || techStack.includes('TypeScript')) {
      insights.push('Minimize bundle size with tree shaking');
      insights.push('Use Web Workers for heavy computations');
      insights.push('Implement service worker for caching');
    }

    return insights;
  }
}
