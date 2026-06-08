import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { vi, type Mock } from 'vitest';
import { GiscusThemeService } from './giscus.service';

describe('GiscusThemeService', () => {
  let service: GiscusThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiscusThemeService);
  });

  afterEach(() => {
    service.stopSyncWithOs();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default theme of light', async () => {
    const theme = await firstValueFrom(service.theme$);
    expect(theme).toBe('light');
  });

  it('should update theme via setTheme', async () => {
    service.setTheme('dark');
    const theme = await firstValueFrom(service.theme$);
    expect(theme).toBe('dark');
  });

  it('should return the current theme synchronously', () => {
    expect(service.theme).toBe('light');
    service.setTheme('dark_dimmed');
    expect(service.theme).toBe('dark_dimmed');
  });

  it('should allow custom string theme', () => {
    service.setTheme('custom_theme');
    expect(service.theme).toBe('custom_theme');
  });

  describe('OS theme sync', () => {
    let matchMediaSpy: ReturnType<typeof vi.spyOn>;
    let addEventListenerSpy: Mock;
    let removeEventListenerSpy: Mock;
    let mockMediaQueryList: { matches: boolean };

    beforeEach(() => {
      mockMediaQueryList = { matches: false };
      addEventListenerSpy = vi.fn();
      removeEventListenerSpy = vi.fn();

      matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
        if (query === '(prefers-color-scheme: dark)') {
          return {
            matches: mockMediaQueryList.matches,
            addEventListener: addEventListenerSpy,
            removeEventListener: removeEventListenerSpy,
          } as unknown as MediaQueryList;
        }
        return {} as MediaQueryList;
      });
    });

    it('should set theme based on OS preference when syncing', () => {
      mockMediaQueryList.matches = false;
      service.syncWithOs();
      expect(service.theme).toBe('light');

      mockMediaQueryList.matches = true;
      service.syncWithOs();
      expect(service.theme).toBe('dark');
    });

    it('should add event listener when syncing with OS', () => {
      service.syncWithOs();
      expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should remove event listener when stopping sync', () => {
      service.syncWithOs();
      service.stopSyncWithOs();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should not add duplicate listeners on multiple sync calls', () => {
      service.syncWithOs();
      service.syncWithOs();
      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    });
  });
});
