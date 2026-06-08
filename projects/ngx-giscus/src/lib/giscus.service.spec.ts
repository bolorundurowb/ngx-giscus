import { TestBed } from '@angular/core/testing';
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

  it('should have default theme of light', (done) => {
    service.theme$.subscribe((theme) => {
      expect(theme).toBe('light');
      done();
    });
  });

  it('should update theme via setTheme', (done) => {
    service.setTheme('dark');
    service.theme$.subscribe((theme) => {
      expect(theme).toBe('dark');
      done();
    });
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
    let matchMediaSpy: jasmine.Spy;
    let addEventListenerSpy: jasmine.Spy;
    let removeEventListenerSpy: jasmine.Spy;
    let mockMediaQueryList: { matches: boolean };

    beforeEach(() => {
      mockMediaQueryList = { matches: false };
      addEventListenerSpy = jasmine.createSpy('addEventListener');
      removeEventListenerSpy = jasmine.createSpy('removeEventListener');

      matchMediaSpy = spyOn(window, 'matchMedia').and.callFake((query: string) => {
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
      expect(addEventListenerSpy).toHaveBeenCalledWith('change', jasmine.any(Function));
    });

    it('should remove event listener when stopping sync', () => {
      service.syncWithOs();
      service.stopSyncWithOs();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('change', jasmine.any(Function));
    });

    it('should not add duplicate listeners on multiple sync calls', () => {
      service.syncWithOs();
      service.syncWithOs();
      expect(addEventListenerSpy.calls.count()).toBe(2);
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    });
  });
});
