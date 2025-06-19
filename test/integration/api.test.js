const request = require('supertest');
const app = require('../../backend/api/index');

describe('API Integration', () => {
  it('should GET tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', 'Bearer devtoken');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should POST a compliant task and succeed', async () => {
    const task = { app: 'Gmail', appUrl: 'https://mail.google.com' };
    const userContext = { username: 'test', role: 'user', password: 'testpass', permissions: ['use_gmail'] };
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', 'Bearer devtoken')
      .send({ task, userContext });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.status).toBe('success');
  });

  it('should block a non-compliant task', async () => {
    const task = { app: 'Gmail', appUrl: 'https://mail.google.com' };
    const userContext = { username: 'test', role: 'guest', password: 'testpass', permissions: ['use_gmail'] };
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', 'Bearer devtoken')
      .send({ task, userContext });
    expect(res.statusCode).toBe(403);
    expect(res.body.status).toBe('blocked');
  });

  it('should get and update allowed models', async () => {
    const getRes = await request(app)
      .get('/api/admin/models')
      .set('Authorization', 'Bearer devtoken');
    expect(getRes.statusCode).toBe(200);
    expect(Array.isArray(getRes.body.models)).toBe(true);

    const postRes = await request(app)
      .post('/api/admin/models')
      .set('Authorization', 'Bearer devtoken')
      .send({ models: ['gpt-4o'] });
    expect(postRes.statusCode).toBe(200);
    expect(postRes.body.models).toContain('gpt-4o');
  });
});
