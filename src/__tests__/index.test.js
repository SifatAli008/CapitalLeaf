const request = require('supertest');
const app = require('../index');

describe('CapitalLeaf API Tests', () => {
  describe('GET /', () => {
    it('should return framework information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('features');
      expect(response.body).toHaveProperty('components');
      
      expect(response.body.status).toBe('operational');
      expect(response.body.version).toBe('1.0.0');
      expect(Array.isArray(response.body.features)).toBe(true);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('components');
      
      expect(response.body.status).toBe('healthy');
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('API Endpoints', () => {
    it('should handle 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Security Components', () => {
    it('should have all required security components', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      const expectedComponents = [
        'infiltration',
        'propagation', 
        'aggregation',
        'exfiltration',
        'intelligence'
      ];

      expectedComponents.forEach(component => {
        expect(response.body.components).toHaveProperty(component);
      });
    });
  });
});
