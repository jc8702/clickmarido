# Click Marido ERP - Reports API Documentation

## Overview

The Reports API provides comprehensive reporting capabilities for the Click Marido ERP system. This API supports multiple report types including executive dashboards, commercial reports, operational reports, and financial reports.

## Base URL

```
/api/v1/reports
/api/v2/reports
```

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

## Rate Limiting

- Dashboard endpoints: 10 requests per minute
- Export endpoints: 5 requests per minute
- Health check endpoints: 20-30 requests per minute
- General endpoints: 10 requests per minute

## API Versions

### v1 (Current Stable)
- Basic reporting functionality
- Standard response format
- Core report types

### v2 (Enhanced - Recommended)
- Enhanced response format with metadata
- Additional health metrics
- Improved error handling
- Performance optimizations

## Report Types

### 1. Executive Dashboard (`/dashboard`)
Provides a comprehensive overview of business KPIs including leads, quotes, conversion rates, revenue, and technician productivity.

**Response Format (v1):**
```json
{
  "totalLeads": 150,
  "totalQuotes": 75,
  "conversionRate": 40,
  "completedOrders": 30,
  "totalRevenue": 15000,
  "totalProfit": 12000,
  "activeTechs": 3,
  "activeWarranties": 5
}
```

**Response Format (v2):**
```json
{
  "success": true,
  "data": {
    "totalLeads": 150,
    "totalQuotes": 75,
    "conversionRate": 40,
    "completedOrders": 30,
    "totalRevenue": 15000,
    "totalProfit": 12000,
    "activeTechs": 3,
    "activeWarranties": 5,
    "metadata": {
      "generatedAt": "2024-01-01T00:00:00.000Z",
      "dataSource": "primary",
      "confidence": "high"
    }
  },
  "version": "v2",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "pagination": {
    "totalItems": 8,
    "hasNextPage": false
  }
}
```

### 2. Commercial Report (`/commercial`)
Provides insights into sales funnel, conversion rates, and top-performing services.

**Response Format:**
```json
{
  "totalQuotes": 75,
  "approvedQuotes": 30,
  "conversionRate": 40,
  "totalRevenue": 15000,
  "completedOrders": 30,
  "ticketMedio": 500,
  "topServices": [
    { "name": "Instalação", "value": 15 },
    { "name": "Manutenção", "value": 12 },
    { "name": "Reparo", "value": 8 }
  ]
}
```

### 3. Operational Report (`/operational`)
Measures technician productivity and service levels.

**Response Format:**
```json
{
  "productivity": [
    { "name": "João Silva", "concluídas": 15 },
    { "name": "Maria Santos", "concluídas": 12 },
    { "name": "Pedro Oliveira", "concluídas": 8 }
  ],
  "avgTimeDays": 2.5
}
```

### 4. Financial Report (`/financial`)
Tracks income, expenses, and profitability trends.

**Response Format:**
```json
{
  "totalIncome": 15000,
  "totalExpense": 3000,
  "netProfit": 12000,
  "chartData": [
    { "month": "01/2024", "receita": 5000, "despesa": 1000, "lucro": 4000 },
    { "month": "02/2024", "receita": 6000, "despesa": 1200, "lucro": 4800 },
    { "month": "03/2024", "receita": 4000, "despesa": 800, "lucro": 3200 }
  ]
}
```

## Health Check Endpoints

### Basic Health Check (`/health`)
Provides basic health status of the reports service.

**Response Format:**
```json
{
  "status": "up",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 45,
  "checks": {
    "database": "up",
    "cache": "up",
    "queries": "up"
  }
}
```

### Enhanced Health Check (v2)
Provides detailed health metrics and recommendations.

**Response Format:**
```json
{
  "success": true,
  "data": {
    "status": "up",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 45,
    "checks": {
      "database": "up",
      "cache": "up",
      "queries": "up"
    },
    "metadata": {
      "checkedAt": "2024-01-01T00:00:00.000Z",
      "service": "reports-api",
      "version": "v2"
    },
    "recommendations": [
      "Consider restarting the service for optimal performance"
    ]
  },
  "version": "v2",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Export Endpoints

### Financial Export (`/export/financial`)
Exports financial data to Excel format.

**Response:** Excel file download
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename="relatorio-financeiro.xlsx"`

## Error Handling

The API uses standard HTTP status codes and consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Internal server error",
    "details": "Additional error details",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/api/v1/reports/dashboard",
    "requestId": "unique-request-id"
  }
}
```

### Common Error Codes

- `400 BAD_REQUEST`: Invalid request parameters
- `401 UNAUTHORIZED`: Missing or invalid authentication
- `403 FORBIDDEN`: Insufficient permissions
- `429 TOO_MANY_REQUESTS`: Rate limit exceeded
- `500 INTERNAL_SERVER_ERROR`: Server-side error

## Caching Strategy

The API implements intelligent caching to improve performance:

- **Dashboard data**: 30 seconds cache
- **Commercial reports**: 60 seconds cache
- **Operational reports**: 60 seconds cache
- **Financial reports**: 60 seconds cache
- **Export data**: No caching (real-time data)

Cache keys are based on company ID and query parameters to ensure data isolation.

## Performance Optimizations

### Query Optimization
- Uses database aggregation for large datasets
- Implements pagination for list operations
- Selective field loading to minimize data transfer
- Batch operations for multiple updates

### Database Optimization
- Connection pooling
- Query timeout handling
- Index optimization for common queries
- Transaction management for data consistency

### Memory Management
- Stream processing for large exports
- Memory usage monitoring
- Garbage collection optimization
- Buffer management for file operations

## Monitoring and Logging

### Request Logging
All API requests are logged with:
- Request ID for tracking
- User and company context
- Execution time
- Response status
- Error details when applicable

### Performance Monitoring
Key metrics tracked:
- Query execution time
- Cache hit/miss ratios
- Memory usage
- Error rates
- Response times

### Health Monitoring
System health is monitored for:
- Database connectivity
- Cache service availability
- Query performance
- Resource utilization

## Security Considerations

### Data Isolation
- All queries are scoped to the company context
- Multi-tenant architecture enforced at the database level
- Company context validation on all requests

### Access Control
- Role-based access control (RBAC)
- Fine-grained permissions for different report types
- Audit logging for all access attempts

### Input Validation
- Comprehensive input validation
- SQL injection prevention
- XSS protection
- Rate limiting to prevent abuse

## Best Practices

### API Usage
1. Use appropriate API version (v2 recommended for new implementations)
2. Implement proper error handling in client applications
3. Respect rate limits and implement retry logic with exponential backoff
4. Use caching on the client side where appropriate
5. Monitor API performance and usage patterns

### Data Handling
1. Always handle potential errors gracefully
2. Implement proper data validation on the client side
3. Use pagination for large datasets
4. Cache data locally when appropriate
5. Consider data freshness requirements when choosing cache duration

### Performance
1. Use the enhanced API version (v2) for better performance
2. Implement client-side caching for frequently accessed data
3. Use appropriate polling intervals based on data refresh needs
4. Monitor query performance and optimize as needed
5. Consider using websockets for real-time updates where appropriate

## Future Enhancements

Planned improvements for the Reports API:

1. **Real-time Updates**: WebSocket support for live data updates
2. **Advanced Analytics**: Machine learning-based insights and predictions
3. **Custom Reports**: User-defined report builder
4. **Scheduled Reports**: Automated report generation and delivery
5. **Enhanced Export Options**: Additional export formats (CSV, PDF, JSON)
6. **Advanced Filtering**: Complex filtering and search capabilities
7. **Data Visualization**: Built-in chart and graph generation
8. **Mobile Optimization**: Optimized endpoints for mobile applications

## Support

For issues and support:
- Check the health endpoints for service status
- Review logs for detailed error information
- Contact the development team for API-specific issues
- Use the request ID for troubleshooting specific requests

## Changelog

### v2.0.0 (Current)
- Enhanced response format with metadata
- Improved error handling
- Performance optimizations
- Health monitoring enhancements
- Rate limiting improvements

### v1.0.0
- Initial stable release
- Basic reporting functionality
- Standard response format
- Core report types

---

*This documentation is subject to change. Always check the API health endpoints for current service status.*