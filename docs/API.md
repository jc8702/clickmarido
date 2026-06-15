# API Documentation

The backend API is built with NestJS and documented via Swagger.

## Running

```bash
cd backend && npm run start:dev
```

Swagger UI: http://localhost:3001/api

## Key Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/forgot-password` | Password recovery |

### Clients
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/clients` | List clients |
| POST | `/api/clients` | Create client |
| GET | `/api/clients/:id` | Get client |
| PUT | `/api/clients/:id` | Update client |
| DELETE | `/api/clients/:id` | Delete client |

### Service Orders
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/service-orders` | List orders |
| POST | `/api/service-orders` | Create order |
| PATCH | `/api/service-orders/:id/status` | Update status |

### WebSocket Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `chat:message` | Bidirectional | WhatsApp chat messages |
| `appointment:update` | Server→Client | Calendar updates |

## API Client (Frontend)

Auto-generated OpenAPI client in `frontend/src/lib/api/generated/`.

```tsx
import { ServiceOrdersApi } from '@/lib/api/generated';
import { apiClient } from '@/lib/api/client';

const api = new ServiceOrdersApi(apiClient);
const orders = await api.listServiceOrders();
```
