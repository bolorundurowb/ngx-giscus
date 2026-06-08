import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GiscusThemeService } from 'ngx-giscus';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [GiscusThemeService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle OS sync', () => {
    expect(component.useOsSync).toBeFalse();
    component.toggleOsSync();
    expect(component.useOsSync).toBeTrue();
    component.toggleOsSync();
    expect(component.useOsSync).toBeFalse();
  });

  it('should render heading', () => {
    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading.textContent).toContain('ngx-giscus Demo');
  });
});
