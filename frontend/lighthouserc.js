module.exports = {
  ci: {
    collect: {
      // Start the local server before running Lighthouse
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      url: ['http://localhost:3000', 'http://localhost:3000/login'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Target Web Vitals (Thresholds de budget via Lighthouse)
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }], // FCP < 1.8s
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // LCP < 2.5s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // CLS < 0.1
      },
    },
    upload: {
      target: 'temporary-public-storage', // Sobe report para URL pública temporária p/ review em PR
    },
  },
};
