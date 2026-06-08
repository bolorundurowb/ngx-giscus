import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, PLATFORM_ID } from '@angular/core';
import { GiscusComponent } from './giscus.component';

@Component({
  template: `<ngx-giscus
    [repo]="repo"
    [repoId]="repoId"
    [theme]="theme"
    [strict]="strict"
    [reactionsEnabled]="reactionsEnabled"
    [emitMetadata]="emitMetadata"
  ></ngx-giscus>`,
  imports: [GiscusComponent],
  standalone: true,
})
class HostComponent {
  repo?: string;
  repoId?: string;
  theme?: string;
  strict?: boolean;
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
}

describe('GiscusComponent', () => {
  describe('browser environment', () => {
    let fixture: ComponentFixture<HostComponent>;
    let host: HostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GiscusComponent, HostComponent],
        providers: [{ provide: PLATFORM_ID, useValue: 'browser' as unknown as object }],
      }).compileComponents();

      fixture = TestBed.createComponent(HostComponent);
      host = fixture.componentInstance;
    });

    it('should create', () => {
      expect(host).toBeTruthy();
    });

    it('should render giscus element', () => {
      host.repo = 'user/repo';
      host.repoId = 'R_123';
      fixture.detectChanges();

      const giscusEl = fixture.nativeElement.querySelector('ngx-giscus');
      expect(giscusEl).toBeTruthy();
    });

    it('should not inject script without repo and repoId', () => {
      fixture.detectChanges();

      const scripts = fixture.nativeElement.querySelectorAll('script');
      expect(scripts.length).toBe(0);
    });

    it('should handle missing iframe gracefully on postMessage', () => {
      host.repo = 'user/repo';
      host.repoId = 'R_123';
      host.theme = 'light';
      fixture.detectChanges();

      expect(() => {
        host.theme = 'dark';
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('server environment (SSR)', () => {
    let fixture: ComponentFixture<HostComponent>;
    let host: HostComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GiscusComponent, HostComponent],
        providers: [{ provide: PLATFORM_ID, useValue: 'server' as unknown as object }],
      }).compileComponents();

      fixture = TestBed.createComponent(HostComponent);
      host = fixture.componentInstance;
    });

    it('should not inject script on server', () => {
      host.repo = 'user/repo';
      host.repoId = 'R_123';
      fixture.detectChanges();

      const scripts = fixture.nativeElement.querySelectorAll('script');
      expect(scripts.length).toBe(0);
    });

    it('should not throw on changes in server environment', () => {
      host.theme = 'dark';
      expect(() => {
        fixture.detectChanges();
      }).not.toThrow();
    });
  });
});
