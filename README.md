# ngx-giscus

[![CI](https://github.com/bolorundurowb/ngx-giscus/actions/workflows/build.yml/badge.svg)](https://github.com/bolorundurowb/ngx-giscus/actions/workflows/build.yml)
[![codecov](https://codecov.io/gh/bolorundurowb/ngx-giscus/branch/master/graph/badge.svg)](https://codecov.io/gh/bolorundurowb/ngx-giscus)
[![npm](https://img.shields.io/npm/v/ngx-giscus.svg)](https://www.npmjs.com/package/ngx-giscus)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

> Native Angular component for [Giscus](https://giscus.app/) — a comments system powered by GitHub Discussions.

**ngx-giscus** lets you embed comment sections in your Angular applications using GitHub Discussions as the backend. It is a standalone, OnPush component that works with Angular 18+ and supports dynamic theme switching, OS-level theme syncing, and server-side rendering safety.

---

## Prerequisites

Before using this library, you must enable GitHub Discussions and install the Giscus app for your repository.

### 1. Enable GitHub Discussions

Go to your repository on GitHub, navigate to **Settings > General > Features**, and check **Discussions**.

### 2. Install the Giscus App

Visit [giscus.app](https://giscus.app/) and click **Install**. Choose the repository (or all repositories) where you want comments enabled.

### 3. Choose a Discussion Category

On the Giscus website, select your repository. You will need two identifiers for the Angular component:

| Property       | Description                                                       |
|----------------|-------------------------------------------------------------------|
| `repoId`       | The repository ID (shown on giscus.app after selecting the repo) |
| `category`     | The discussion category name                                      |
| `categoryId`   | The category ID (shown on giscus.app after selecting the category)|

You only need to set these once. Giscus will create a discussion per page (based on your `mapping` choice) the first time someone comments.

---

## Installation

```bash
npm install ngx-giscus
```

**Peer dependencies:** This library requires `@angular/core` and `@angular/common` version 18.x or 19.x.

```json
{
  "@angular/core": ">=18.0.0 <20.0.0",
  "@angular/common": ">=18.0.0 <20.0.0"
}
```

---

## Quick Start

Import `GiscusComponent` in your standalone component or module and add it to your template.

```typescript
import { Component } from '@angular/core';
import { GiscusComponent } from 'ngx-giscus';

@Component({
  selector: 'app-blog-post',
  template: `
    <article>
      <h1>My Blog Post</h1>
      <p>Lorem ipsum dolor sit amet...</p>
    </article>

    <ngx-giscus
      repo="your-username/your-repo"
      repoId="R_kgDO..."
      category="Announcements"
      categoryId="DIC_kw..."
      mapping="pathname"
      theme="light"
      lang="en"
    ></ngx-giscus>
  `,
  imports: [GiscusComponent],
  standalone: true,
})
export class BlogPostComponent {}
```

---

## API Reference

### `GiscusComponent`

A standalone Angular component. Add `<ngx-giscus>` to any template to embed Giscus.

#### Inputs

| Input               | Type                                  | Default     | Description                                                                 |
|---------------------|---------------------------------------|-------------|-----------------------------------------------------------------------------|
| `repo`              | `string`                              | —           | GitHub repository in `owner/name` format (e.g., `giscus/giscus`).          |
| `repoId`            | `string`                              | —           | Repository ID from giscus.app.                                              |
| `category`          | `string`                              | —           | Discussion category name.                                                   |
| `categoryId`        | `string`                              | —           | Discussion category ID from giscus.app.                                     |
| `mapping`           | `GiscusMapping`                       | —           | Mapping between page and discussion: `url`, `title`, `og:title`, `specific`, `number`, `pathname`. |
| `term`              | `string`                              | —           | Search term when `mapping="specific"`.                                      |
| `strict`            | `boolean`                             | `undefined` | Use strict title matching.                                                  |
| `reactionsEnabled`  | `boolean`                             | `undefined` | Enable reactions on the main post.                                          |
| `emitMetadata`      | `boolean`                             | `undefined` | Emit discussion metadata.                                                   |
| `inputPosition`     | `'top'` \| `'bottom'`                 | `undefined` | Placement of the comment input box.                                         |
| `theme`             | `GiscusTheme`                         | `undefined` | Theme for the comment widget (see below).                                   |
| `lang`              | `string`                              | `undefined` | Language code (e.g., `en`, `fr`, `de`).                                     |
| `loading`           | `'lazy'` \| `'eager'`                 | `undefined` | Loading strategy for the Giscus iframe.                                     |

---

### `GiscusTheme` Type

```typescript
type GiscusTheme =
  | 'light'
  | 'light_high_contrast'
  | 'light_protanopia'
  | 'light_tritanopia'
  | 'dark'
  | 'dark_high_contrast'
  | 'dark_protanopia'
  | 'dark_tritanopia'
  | 'dark_dimmed'
  | 'preferred_color_scheme'
  | 'transparent_dark'
  | 'noborder_light'
  | 'noborder_dark'
  | 'noborder_gray'
  | 'cobalt'
  | 'purple_dark'
  | string;
```

---

## Theming

### Manual Theme Control

Bind the `theme` input directly to switch themes programmatically:

```typescript
import { Component } from '@angular/core';
import { GiscusComponent, GiscusTheme } from 'ngx-giscus';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="toggleTheme()">Toggle Theme</button>
    <ngx-giscus [theme]="currentTheme" repo="..." repoId="..." category="..." categoryId="..." />
  `,
  imports: [GiscusComponent],
  standalone: true,
})
export class AppComponent {
  currentTheme: GiscusTheme = 'light';

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
  }
}
```

### Operating System Theme Sync

Use `GiscusThemeService` to automatically sync the Giscus theme with the user's OS-level dark/light preference:

```typescript
import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { GiscusComponent, GiscusThemeService } from 'ngx-giscus';

@Component({
  selector: 'app-root',
  template: `<ngx-giscus [theme]="themeService.theme$ | async" repo="..." repoId="..." category="..." categoryId="..." />`,
  imports: [GiscusComponent, AsyncPipe],
  standalone: true,
})
export class AppComponent implements OnInit {
  constructor(public themeService: GiscusThemeService) {}

  ngOnInit(): void {
    this.themeService.syncWithOs();
  }
}
```

### `GiscusThemeService` API

| Method               | Description                                                                      |
|----------------------|----------------------------------------------------------------------------------|
| `setTheme(theme)`    | Manually sets the theme. Overrides OS sync until the next sync change.          |
| `syncWithOs()`       | Starts listening to `(prefers-color-scheme: dark)` and updates the theme automatically. |
| `stopSyncWithOs()`   | Stops listening to OS preference changes.                                        |
| `theme$`             | `Observable<GiscusTheme>` — Emits the current theme.                             |
| `theme`              | `GiscusTheme` — Current theme value (synchronous getter).                        |

---

## Server-Side Rendering (SSR)

This component is browser-only. When running on the server (Angular Universal / SSR), the component renders an empty `<div>` and skips all DOM operations such as script injection and `postMessage`. No server-side errors will occur.

If you are using Angular hydration, the component will activate on the client once the giscus script loads, without interfering with the hydration process.

---

## Development

### Setup

```bash
git clone https://github.com/bolorundurowb/ngx-giscus.git
cd ngx-giscus
npm install
```

### Build the Library

```bash
ng build ngx-giscus
```

### Run Tests

```bash
ng test ngx-giscus --no-watch --browsers=ChromeHeadless
```

### Serve the Demo App

First build the library, then serve the demo:

```bash
ng build ngx-giscus
ng serve demo
```

Open `http://localhost:4200` in your browser.

> **Note:** The demo app points to this repository's GitHub Discussions. Update the `repoId` and `categoryId` in `projects/demo/src/app/app.component.html` to match your own repository to see live comments.

---

## License

[Apache-2.0](LICENSE)
