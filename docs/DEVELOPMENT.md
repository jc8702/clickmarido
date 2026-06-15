# Development Guidelines

## Code Style

- TypeScript strict mode
- ESLint + Prettier (enforced via Husky pre-commit)
- Conventional commits (`feat:`, `fix:`, `refactor:`, etc.)
- Named exports for components, default exports for pages

## Component Patterns

```tsx
// Component with forwardRef
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => (
    <button ref={ref} className={cn(styles, className)} {...props} />
  )
);
Button.displayName = 'Button';
export { Button };
```

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ServiceOrderTable` |
| Hooks | camelCase prefixed `use` | `useAuth` |
| Utilities | camelCase | `formatCurrency` |
| Types/Interfaces | PascalCase | `ServiceOrder` |
| Files (components) | kebab-case | `service-order-table.tsx` |
| Files (pages) | kebab-case | `ordens-servico/page.tsx` |

## State Management Principles

- Keep state as close as possible to where it's used
- Use SWR for server state (automatic cache invalidation)
- Use React Context for global state (auth, theme, layout)
- Avoid prop drilling > 3 levels

## Performance

- Use `React.memo` for expensive renders in tables/lists
- Virtualize long lists (already configured via `@tanstack/react-virtual`)
- Lazy load route components (Next.js handles automatically)
- Optimize images with `next/image`
