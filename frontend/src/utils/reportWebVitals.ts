import { Metric, onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

/**
 * Endpoint centralizado para disparo de métricas de Web Vitals.
 * O target ideal é enviar isso para um endpoint de ingestão como DataDog,
 * Google Analytics ou um serviço custom (ex: Prometheus/Grafana do backend).
 */
const sendToAnalytics = (metric: Metric) => {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    navigationType: metric.navigationType,
  });

  // Utilizar sendBeacon garante que o payload é enviado mesmo se o usuário fechar a aba
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/metrics/vitals', body);
  } else {
    fetch('/api/metrics/vitals', { body, method: 'POST', keepalive: true });
  }

  // Debug local se não estivermos em PRD
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[Web Vitals] ${metric.name}: ${metric.value}ms (${metric.rating})`);
  }
};

/**
 * Ativa os listeners nativos do browser para coleta de Web Vitals.
 * Meta:
 * FCP: <1.8s
 * LCP: <2.5s
 * CLS: <0.1
 * INP/FID: <200ms
 */
export function setupVitalsTracking() {
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onINP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
