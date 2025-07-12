import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private _isAdmin = signal(false);

  get isAdmin() {
    return this._isAdmin.asReadonly();
  }

  setAdminMode(value: boolean): void {
    this._isAdmin.set(value);
  }

  toggleAdminMode(): void {
    this._isAdmin.update(current => !current);
  }
}
