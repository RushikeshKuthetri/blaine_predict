// services/theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme = new BehaviorSubject<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  theme$ = this._theme.asObservable();

  get current() { return this._theme.value; }

  toggle(): void {
    const next = this._theme.value === 'dark' ? 'light' : 'dark';
    this._theme.next(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }

  // Call once on app init to restore saved theme
  init(): void {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const theme = saved ?? 'light';
    this._theme.next(theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}