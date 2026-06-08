import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import type { GiscusTheme } from './giscus.types';

const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

@Injectable({ providedIn: 'root' })
export class GiscusThemeService implements OnDestroy {
  private themeSubject = new BehaviorSubject<GiscusTheme>('light');
  private mediaQueryList?: MediaQueryList;
  private mediaQueryListener?: (event: MediaQueryListEvent) => void;

  get theme$(): Observable<GiscusTheme> {
    return this.themeSubject.asObservable();
  }

  get theme(): GiscusTheme {
    return this.themeSubject.value;
  }

  setTheme(theme: GiscusTheme): void {
    this.themeSubject.next(theme);
  }

  syncWithOs(): void {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    this.stopSyncWithOs();

    this.mediaQueryList = window.matchMedia(DARK_MODE_QUERY);
    this.mediaQueryListener = (event: MediaQueryListEvent) => {
      this.themeSubject.next(event.matches ? 'dark' : 'light');
    };

    this.mediaQueryList.addEventListener('change', this.mediaQueryListener);
    this.themeSubject.next(this.mediaQueryList.matches ? 'dark' : 'light');
  }

  stopSyncWithOs(): void {
    if (this.mediaQueryList && this.mediaQueryListener) {
      this.mediaQueryList.removeEventListener('change', this.mediaQueryListener);
    }
    this.mediaQueryList = undefined;
    this.mediaQueryListener = undefined;
  }

  ngOnDestroy(): void {
    this.stopSyncWithOs();
    this.themeSubject.complete();
  }
}
