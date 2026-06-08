import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GiscusComponent, GiscusTheme, GiscusThemeService } from 'ngx-giscus';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, GiscusComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  theme: GiscusTheme = 'light';
  useOsSync = false;
  availableThemes: { label: string; value: GiscusTheme }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'Dark Dimmed', value: 'dark_dimmed' },
    { label: 'Transparent Dark', value: 'transparent_dark' },
    { label: 'Preferred Color Scheme', value: 'preferred_color_scheme' },
    { label: 'Light High Contrast', value: 'light_high_contrast' },
    { label: 'Dark High Contrast', value: 'dark_high_contrast' },
    { label: 'Cobalt', value: 'cobalt' },
    { label: 'Purple Dark', value: 'purple_dark' },
  ];

  constructor(public themeService: GiscusThemeService) {}

  ngOnInit(): void {
    this.themeService.theme$.subscribe((t) => {
      this.theme = t;
    });
  }

  toggleOsSync(): void {
    this.useOsSync = !this.useOsSync;
    if (this.useOsSync) {
      this.themeService.syncWithOs();
    } else {
      this.themeService.stopSyncWithOs();
    }
  }

  onThemeChange(): void {
    if (!this.useOsSync) {
      this.themeService.setTheme(this.theme);
    }
  }

  ngOnDestroy(): void {
    this.themeService.stopSyncWithOs();
  }
}
