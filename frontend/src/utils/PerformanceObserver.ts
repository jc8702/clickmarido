/**
 * Wrapper em torno da API de PerformanceObserver.
 * Foca em capturar assets de long-load (ex: Imagens pesadas, scripts de terceiros lentos).
 */
export class AppPerformanceObserver {
  private observer: PerformanceObserver | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.init();
    }
  }

  private init() {
    this.observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.processEntry(entry);
      }
    });

    try {
      this.observer.observe({
        entryTypes: ['measure', 'navigation', 'resource', 'longtask']
      });
    } catch (e) {
      console.warn('PerformanceObserver config not fully supported in this browser.', e);
    }
  }

  private processEntry(entry: PerformanceEntry) {
    // Alerta de Long Task (bloqueio de thread)
    if (entry.entryType === 'longtask') {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Performance] Long Task detected: ${entry.duration.toFixed(2)}ms`, entry);
      }
      // TODO: Report to Sentry
    }

    // Monitoramento de Assets pesados (Resource timing)
    if (entry.entryType === 'resource') {
      const resourceEntry = entry as PerformanceResourceTiming;
      // Alertar se um recurso demorar mais que 1 segundo para carregar
      if (resourceEntry.duration > 1000) {
        console.warn(`[Performance] Slow resource loaded (${resourceEntry.duration.toFixed(2)}ms): ${resourceEntry.name}`);
      }
    }
  }

  public disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Singleton para a aplicação
export const performanceObserver = new AppPerformanceObserver();
