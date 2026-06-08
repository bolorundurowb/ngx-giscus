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
