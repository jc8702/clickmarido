# Design Tokens

## Color System

All colors are defined as CSS custom properties in `globals.css`.

### Light Mode

| Token | Value | Contrast (AAA) |
|-------|-------|-----------------|
| `--background` | `#fcfcfd` | — |
| `--foreground` | `#09090b` | 17.7:1 |
| `--primary` | `#5b21b6` | 7.9:1 |
| `--primary-foreground` | `#ffffff` | 8.3:1 |
| `--accent` | `#1e3a8a` | 8.9:1 |
| `--success` | `#166534` | 7.8:1 |
| `--warning` | `#7c2d12` | 8.3:1 |
| `--destructive` | `#991b1b` | 7.8:1 |

### Dark Mode

| Token | Value | Contrast (AAA) |
|-------|-------|-----------------|
| `--background` | `#09090b` | — |
| `--foreground` | `#fafafa` | 17.7:1 |
| `--primary` | `#a78bfa` | 7.1:1 |
| `--success` | `#4ade80` | 9.7:1 |
| `--warning` | `#fbbf24` | 12.3:1 |
| `--destructive` | `#fca5a5` | 9.8:1 |

## Typography

- **Font**: Geist (sans) + Geist Mono (monospace)
- **Scale**: 12px / 14px / 16px / 18px / 24px / 30px / 36px

## Spacing

4px base unit. Use Tailwind spacing scale.

## Border Radius

- `--radius`: 0.75rem (12px)
- `--radius-md`: 10px
- `--radius-sm`: 8px

## Shadows

- `shadow-sm`: Small card shadow
- `shadow-md`: Elevated card
- `shadow-lg`: Modal/dropdown
- `glow-primary`: Primary glow (focus states)
