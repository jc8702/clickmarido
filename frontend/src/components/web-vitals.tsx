'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
  };

  if (process.env.NODE_ENV === 'production') {
    const url = `/api/vitals`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, JSON.stringify(body));
    } else {
      fetch(url, { body: JSON.stringify(body), method: 'POST', keepalive: true });
    }
  }

  if (process.env.NODE_ENV === 'development') {
    const rating = metric.rating === 'good' ? '🟢' : metric.rating === 'needs-improvement' ? '🟡' : '🔴';
    console.log(`${rating} ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`);
  }
}

export function WebVitals() {
  useEffect(() => {
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onINP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  }, []);

  return null;
}
