import '@analogjs/vite-plugin-angular/setup-vitest';

import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

// jsdom doesn't implement matchMedia — provide a stub so vi.spyOn can override it per test
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (_query: string): MediaQueryList =>
    ({
      matches: false,
      media: _query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList,
});
