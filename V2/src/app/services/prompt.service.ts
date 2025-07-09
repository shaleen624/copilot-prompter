
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Prompt } from '../models/prompt.model';

@Injectable({
  providedIn: 'root'
})
export class PromptService {
  private http = inject(HttpClient);
  private promptsUrl = 'api/prompts';  // URL to web api

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getPrompts(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(this.promptsUrl)
      .pipe(
        tap(_ => console.log('fetched prompts')),
        catchError(this.handleError<Prompt[]>('getPrompts', []))
      );
  }

  getPrompt(id: string): Observable<Prompt> {
    const url = `${this.promptsUrl}/${id}`;
    return this.http.get<Prompt>(url).pipe(
      tap(_ => console.log(`fetched prompt id=${id}`)),
      catchError(this.handleError<Prompt>(`getPrompt id=${id}`))
    );
  }

  addPrompt(prompt: Prompt): Observable<Prompt> {
    return this.http.post<Prompt>(this.promptsUrl, prompt, this.httpOptions).pipe(
      tap((newPrompt: Prompt) => console.log(`added prompt w/ id=${newPrompt.id}`)),
      catchError(this.handleError<Prompt>('addPrompt'))
    );
  }

  updatePrompt(prompt: Prompt): Observable<any> {
    return this.http.put(this.promptsUrl, prompt, this.httpOptions).pipe(
      tap(_ => console.log(`updated prompt id=${prompt.id}`)),
      catchError(this.handleError<any>('updatePrompt'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation, error);
      return of(result as T);
    };
  }
}