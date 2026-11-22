const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/db');

describe('Lead API Endpoints', () => {
  let createdLeadId = '';
  const testEmail = `lead_${Date.now()}@acme.com`;

  afterAll(async () => {
    await prisma.lead.deleteMany({
      where: { email: { contains: 'acme.com' } },
    });
    await prisma.$disconnect();
  });

  it('GET /api/leads - returns leads list and pagination metadata', async () => {
    const res = await request(app).get('/api/leads');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.leads)).toBe(true);
    expect(res.body.data.pagination).toBeDefined();
  });

  it('GET /api/leads/stats - returns lead summary counts and metrics', async () => {
    const res = await request(app).get('/api/leads/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('total');
    expect(res.body.data).toHaveProperty('byStatus');
    expect(res.body.data.byStatus).toHaveProperty('New');
    expect(res.body.data.byStatus).toHaveProperty('Qualified');
  });

  it('POST /api/leads - successfully creates a lead with valid data', async () => {
    const newLead = {
      name: 'John Doe',
      email: testEmail,
      phone: '+1-555-0199',
      company: 'Acme Corporation',
      source: 'Website',
      status: 'New',
      notes: 'Initial contact via contact us page.',
    };

    const res = await request(app)
      .post('/api/leads')
      .send(newLead);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.lead).toHaveProperty('id');
    expect(res.body.data.lead.name).toBe('John Doe');
    expect(res.body.data.lead.email).toBe(testEmail.toLowerCase());
    createdLeadId = res.body.data.lead.id;
  });

  it('POST /api/leads - validates invalid email format', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Jane Doe',
        email: 'invalid-email',
        phone: '12345678',
        company: 'Corp',
        source: 'Referral',
        status: 'New',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.some((e) => e.field === 'email')).toBe(true);
  });

  it('POST /api/leads - validates invalid status value', async () => {
    const res = await request(app)
      .post('/api/leads')
      .send({
        name: 'Jane Doe',
        email: 'jane@valid.com',
        phone: '12345678',
        company: 'Corp',
        source: 'Website',
        status: 'InvalidStatus',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/leads/:id - returns lead by ID', async () => {
    const res = await request(app).get(`/api/leads/${createdLeadId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.lead.id).toBe(createdLeadId);
  });

  it('PUT /api/leads/:id - successfully updates a lead', async () => {
    const res = await request(app)
      .put(`/api/leads/${createdLeadId}`)
      .send({
        status: 'Contacted',
        notes: 'Had introductory call today.',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.lead.status).toBe('Contacted');
    expect(res.body.data.lead.notes).toBe('Had introductory call today.');
  });

  it('GET /api/leads?search=Acme - filters leads by search query', async () => {
    const res = await request(app).get('/api/leads?search=Acme');
    expect(res.status).toBe(200);
    expect(res.body.data.leads.length).toBeGreaterThan(0);
    expect(res.body.data.leads.some((l) => l.company.includes('Acme'))).toBe(true);
  });

  it('DELETE /api/leads/:id - successfully deletes lead', async () => {
    const res = await request(app).delete(`/api/leads/${createdLeadId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify lead no longer exists
    const getRes = await request(app).get(`/api/leads/${createdLeadId}`);
    expect(getRes.status).toBe(404);
  });
});
