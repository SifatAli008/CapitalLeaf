/**
 * CI/CD Pipeline Test
 * 
 * This test verifies that the CI/CD pipeline is properly configured
 * and all components are working correctly.
 */

const request = require('supertest');
const app = require('../index');

describe('CI/CD Pipeline Tests', () => {
  describe('Application Health', () => {
    it('should respond to health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('API Endpoints', () => {
    it('should serve main application endpoint', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.message).toContain('CapitalLeaf');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.status).toBe('operational');
    });

    it('should have all security components', async () => {
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
        expect(Array.isArray(response.body.components[component])).toBe(true);
      });
    });
  });

  describe('Security Features', () => {
    it('should have all required security features', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      const expectedFeatures = [
        'Microservice Network Segmentation',
        'Behavior-Driven Data Loss Prevention',
        'Real-Time Threat Intelligence',
        'AI-Driven Intrusion Detection',
        'Zero Trust Access Control',
        'Role-Based Access to Data Vaults',
        'Secure Data Pipelines with Audit Trails'
      ];

      expectedFeatures.forEach(feature => {
        expect(response.body.features).toContain(feature);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors gracefully', async () => {
      const response = await request(app)
        .get('/nonexistent-endpoint')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });
  });
});
