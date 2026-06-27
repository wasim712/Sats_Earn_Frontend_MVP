export {};

// Strict types for Google Analytics dataLayer and gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (
      command: 'config' | 'set' | 'js' | 'event',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}
