const request = require('supertest');
const app = require('../server');

describe('Waste Records API - Auth Protection', () => {
  it('GET /api/waste-records should return 401 without token', async () => {
    const res = await request(app).get('/api/waste-records');
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/waste-records should return 401 without token', async () => {
    const res = await request(app)
      .post('/api/waste-records')
      .send({ wasteType: 'General', quantity: 50, location: 'Brisbane' });
    expect(res.statusCode).toBe(401);
  });

  it('DELETE should return 401 without token', async () => {
    const res = await request(app).delete('/api/waste-records/fakeid');
    expect(res.statusCode).toBe(401);
  });
});const request = require('supertest');
const app = require('../server');

describe('Waste Records API - Auth Protection', () => {
  it('GET /api/waste-records should return 401 without token', async () => {
    const res = await request(app).get('/api/waste-records');
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/waste-records should return 401 without token', async () => {
    const res = await request(app)
      .post('/api/waste-records')
      .send({ wasteType: 'General', quantity: 50, location: 'Brisbane' });
    expect(res.statusCode).toBe(401);
  });

  it('DELETE should return 401 without token', async () => {
    const res = await request(app).delete('/api/waste-records/fakeid');
    expect(res.statusCode).toBe(401);
  });
});