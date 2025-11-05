import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _isAdmin = signal(true);
  private _isLoggedIn = signal(true);
  private _enableLogin = signal(true); // Set to false to bypass login

  get isAdmin() {
    return this._isAdmin.asReadonly();
  }

  get isLoggedIn() {
    return this._isLoggedIn.asReadonly();
  }

  get enableLogin() {
    return this._enableLogin.asReadonly();
  }

  setAdminMode(value: boolean): void {
    this._isAdmin.set(value);
  }

  toggleAdminMode(): void {
    this._isAdmin.update(current => !current);
  }

  setLoginEnabled(value: boolean): void {
    this._enableLogin.set(value);
  }

  login(username: string, password: string): boolean {
    // Simple demo authentication
    if (username === 'admin' && password === 'admin') {
      this._isLoggedIn.set(true);
      this._isAdmin.set(true);
      return true;
    } else if (username === 'user' && password === 'user') {
      this._isLoggedIn.set(true);
      this._isAdmin.set(false);
      return true;
    }
    return false;
  }

  logout(): void {
    this._isLoggedIn.set(false);
    this._isAdmin.set(false);
  }

  // Helper method to check if user is logged in (returns boolean value)
  checkLoggedIn(): boolean {
    return this._isLoggedIn();
  }
}
