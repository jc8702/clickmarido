# Testing Strategy

## Unit & Integration Tests (Vitest)

```bash
# Frontend
cd frontend && npm run test        # Run all tests
npm run test:cov                    # With coverage (target: 70%)
```

**Coverage targets:**
- Lines: 70%
- Functions: 70%
- Branches: 60%
- Statements: 70%

### Writing Tests

```tsx
// Components: test render, interactions, accessibility
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

it('renders with label and handles click', async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Click me</Button>);
  await userEvent.click(screen.getByRole('button', { name: /click me/i }));
  expect(onClick).toHaveBeenCalledTimes(1);
});
```

## E2E Tests (Playwright)

```bash
cd frontend && npx playwright test
```

Located in `frontend/e2e/`.

## Accessibility Testing

- aXe DevTools browser extension (manual, dev)
- Pa11y CI (automated, CI/CD):
  ```bash
  cd frontend && npx pa11y-ci --config .pa11yci
  ```
- Screen reader: NVDA (Windows) or VoiceOver (Mac)

## CI/CD Pipeline

See `.github/workflows/ci.yml`:

1. **lint-typecheck** — ESLint + TypeScript check (parallel)
2. **test** — Vitest running all unit/integration tests
3. **build** — Production build (depends on lint + test passing)

Runs on push/PR to `main` and `develop`.
