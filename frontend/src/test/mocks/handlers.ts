import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock login endpoint
  http.post('*/api-json/auth/login', () => {
    return HttpResponse.json({
      token: 'fake-jwt-token',
      user: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
    });
  }),
  
  // Mock dashboard stats
  http.get('*/api-json/dashboard/stats', () => {
    return HttpResponse.json({
      totalRevenue: 5000,
      activeClients: 15,
      pendingAppointments: 3,
      completedOrders: 10,
    });
  }),
  
  // Mock clients list
  http.get('*/api-json/clients', () => {
    return HttpResponse.json([
      { id: 'client-1', name: 'Client One', email: 'client1@example.com', phone: '11999999999' },
    ]);
  }),
  
  // Mock create client
  http.post('*/api-json/clients', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 'new-client', ...(body as any) }, { status: 201 });
  }),
  
  // Mock appointments list
  http.get('*/api-json/appointments', () => {
    return HttpResponse.json([
      { id: 'appt-1', clientId: 'client-1', date: new Date().toISOString(), status: 'SCHEDULED' },
    ]);
  }),
];
