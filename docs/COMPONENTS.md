# Component Catalog

## UI Components (`src/components/ui/`)

| Component | Variants | States | Accessibility |
|-----------|----------|--------|---------------|
| `Button` | primary, secondary, danger, ghost, outline, link, success, warning | default, hover, active, disabled, loading | focus-visible ring, aria-label on icon-only |
| `Input` | text, email, password, mask (cpf/cnpj/telefone) | default, error, success, disabled | aria-invalid, label association |
| `Badge` | primary, secondary, success, warning, danger, info, outline | hover | - |
| `Dialog` | - | open/close (animated) | Radix dialog, aria-labelledby, Escape key |
| `Select` | single, multi | focus, disabled | Radix select, keyboard arrows |
| `Table` | sortable, selectable, virtualized | loading, empty, selected | scope="col", keyboard row nav |
| `Checkbox` | checked, indeterminate | focus, disabled | Radix checkbox |
| `Tabs` | - | active, focus | Radix tabs, keyboard arrows |
| `DropdownMenu` | - | open/close | Radix menu, keyboard nav |
| `Tooltip` | - | show/hide | Radix tooltip |
| `Spinner` | sm, md, lg, xl | - | - |
| `Skeleton` | - | - | - |
| `Card` | - | - | - |
| `Separator` | - | - | - |
| `ScrollArea` | - | - | Radix scroll |

## Layout Components (`src/components/layout/`)

- `DashboardLayout` — Main authenticated layout (sidebar + topbar + content)
- `Sidebar` — Collapsible navigation sidebar
- `Topbar` — Top bar with breadcrumb, tenant selector, theme toggle, profile menu
- `PageHeader` — Page title with breadcrumbs, icon, badge, and actions

## Feature Components

- `DataTable` — Generic data table with sorting, selection, and virtualization
- `KPICard` — KPI metric card for dashboard
- `FormField` — Form field with label, error, and hint
- `FilterPanel` — Search + filters + date range
- `AppointmentModal` / `EventDialog` — Calendar event modals
- `ServiceOrderExecution` — Service order execution workflow
