import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type {
  GiscusInputPosition,
  GiscusLoading,
  GiscusMapping,
  GiscusTheme,
} from './giscus.types';

const GISCUS_SCRIPT_URL = 'https://giscus.app/client.js';
const GISCUS_IFRAME_SELECTOR = 'iframe.giscus-frame';

interface GiscusConfig {
  theme?: GiscusTheme;
  repo?: string;
  repoId?: string;
  term?: string;
  mapping?: GiscusMapping;
  category?: string;
  categoryId?: string;
  strict?: boolean;
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
  inputPosition?: GiscusInputPosition;
  lang?: string;
}

interface GiscusMessage {
  giscus: {
    setConfig: GiscusConfig;
  };
}

@Component({
  selector: 'ngx-giscus',
  template: '',
  styles: ':host { display: block; }',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiscusComponent implements OnInit, OnChanges, OnDestroy {
  @Input() repo?: string;
  @Input() repoId?: string;
  @Input() category?: string;
  @Input() categoryId?: string;
  @Input() mapping?: GiscusMapping;
  @Input() term?: string;
  @Input() strict?: boolean;
  @Input() reactionsEnabled?: boolean;
  @Input() emitMetadata?: boolean;
  @Input() inputPosition?: GiscusInputPosition;
  @Input() theme?: GiscusTheme;
  @Input() lang?: string;
  @Input() loading?: GiscusLoading;

  private scriptElement?: HTMLScriptElement;
  private isBrowser: boolean;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && this.repo && this.repoId) {
      this.loadGiscus();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isBrowser || !this.repo || !this.repoId) {
      return;
    }

    const firstChange = Object.values(changes).some((c) => c.firstChange);

    if (firstChange) {
      this.loadGiscus();
      return;
    }

    this.sendMessage();
  }

  ngOnDestroy(): void {
    this.removeScript();
  }

  private loadGiscus(): void {
    this.removeScript();

    const script = document.createElement('script');
    script.src = GISCUS_SCRIPT_URL;
    script.crossOrigin = 'anonymous';
    script.async = true;

    this.setDataAttributes(script);

    const host = this.elementRef.nativeElement;
    host.appendChild(script);
    this.scriptElement = script;
  }

  private setDataAttributes(script: HTMLScriptElement): void {
    const attrs: Record<string, string | undefined> = {
      'data-repo': this.repo,
      'data-repo-id': this.repoId,
      'data-category': this.category,
      'data-category-id': this.categoryId,
      'data-mapping': this.mapping,
      'data-term': this.term,
      'data-strict': this.strict != null ? String(this.strict) : undefined,
      'data-reactions-enabled': this.reactionsEnabled != null ? String(this.reactionsEnabled) : undefined,
      'data-emit-metadata': this.emitMetadata != null ? String(this.emitMetadata) : undefined,
      'data-input-position': this.inputPosition,
      'data-theme': this.theme,
      'data-lang': this.lang,
      'data-loading': this.loading,
    };

    for (const [key, value] of Object.entries(attrs)) {
      if (value != null) {
        script.setAttribute(key, value);
      }
    }
  }

  private sendMessage(): void {
    const iframe = this.elementRef.nativeElement.querySelector<HTMLIFrameElement>(GISCUS_IFRAME_SELECTOR);
    if (!iframe?.contentWindow) {
      return;
    }

    const config: GiscusConfig = {};

    if (this.theme) {
      config.theme = this.theme;
    }
    if (this.repo) {
      config.repo = this.repo;
    }
    if (this.repoId) {
      config.repoId = this.repoId;
    }
    if (this.term) {
      config.term = this.term;
    }
    if (this.mapping) {
      config.mapping = this.mapping;
    }
    if (this.category) {
      config.category = this.category;
    }
    if (this.categoryId) {
      config.categoryId = this.categoryId;
    }
    if (this.strict != null) {
      config.strict = this.strict;
    }
    if (this.reactionsEnabled != null) {
      config.reactionsEnabled = this.reactionsEnabled;
    }
    if (this.emitMetadata != null) {
      config.emitMetadata = this.emitMetadata;
    }
    if (this.inputPosition) {
      config.inputPosition = this.inputPosition;
    }
    if (this.lang) {
      config.lang = this.lang;
    }

    const message: GiscusMessage = { giscus: { setConfig: config } };
    iframe.contentWindow.postMessage(message, 'https://giscus.app');
  }

  private removeScript(): void {
    if (this.scriptElement?.parentNode) {
      this.scriptElement.parentNode.removeChild(this.scriptElement);
      this.scriptElement = undefined;
    }
  }
}
