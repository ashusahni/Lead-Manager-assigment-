const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/db');

describe('Auth API Endpoints', () => {
  const testUser = {
    name: 'Test Sales Rep',
    email: `test_${Date.now()}@merutest.com`,
    password: 'securepassword123',
  };

  let token = '';

  afterAll(async () => {
    // Clean up test user
    await prisma.user.deleteMany({
      where: { email: { contains: 'merutest.com' } },
    });
    await prisma.$disconnect();
  });

  it('POST /api/auth/register - successfully registers a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toHaveProperty('id');
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data).toHaveProperty('token');
  });

  it('POST /api/auth/register - rejects duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/register - validates required fields and password length', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bademail', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('POST /api/auth/login - successfully logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    token = res.body.data.token;
  });

  it('POST /api/auth/login - rejects invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me - returns authenticated user profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
  });

  it('GET /api/auth/me - rejects request without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
