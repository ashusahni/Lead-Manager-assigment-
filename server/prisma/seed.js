const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const demoUser = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: hashedPassword,
    },
  });

  console.log(`Demo user created: ${demoUser.email} (password: password123)`);

  const initialLeads = [
    {
      name: 'Sarah Connor',
      email: 'sarah.connor@cyberdyne.io',
      phone: '+1 (555) 234-5678',
      company: 'Cyberdyne Systems',
      source: 'Website',
      status: 'New',
      notes: 'Interested in enterprise automated lead processing pipeline.',
      userId: demoUser.id,
    },
    {
      name: 'Bruce Wayne',
      email: 'bruce@wayneenterprises.com',
      phone: '+1 (555) 987-6543',
      company: 'Wayne Enterprises',
      source: 'Referral',
      status: 'Qualified',
      notes: 'High priority lead. Met at Tech Summit 2026. Ready for proposal.',
      userId: demoUser.id,
    },
    {
      name: 'Tony Stark',
      email: 'tony@starkindustries.com',
      phone: '+1 (555) 111-2233',
      company: 'Stark Industries',
      source: 'LinkedIn',
      status: 'Contacted',
      notes: 'Demo scheduled for next Tuesday regarding CRM integration.',
      userId: demoUser.id,
    },
    {
      name: 'Diana Prince',
      email: 'diana.prince@themyscira.org',
      phone: '+1 (555) 444-5566',
      company: 'Themyscira Global',
      source: 'Cold Outreach',
      status: 'Qualified',
      notes: 'Requested product comparison sheet and pricing tiers.',
      userId: demoUser.id,
    },
    {
      name: 'Peter Parker',
      email: 'peter@dailybugle.net',
      phone: '+1 (555) 777-8899',
      company: 'Daily Bugle Media',
      source: 'Website',
      status: 'New',
      notes: 'Inquired about freelance team subscription.',
      userId: demoUser.id,
    },
    {
      name: 'Clark Kent',
      email: 'clark@dailyplanet.org',
      phone: '+1 (555) 333-2211',
      company: 'Daily Planet',
      source: 'Event',
      status: 'Lost',
      notes: 'Budget postponed to Q3 next year. Keep warm.',
      userId: demoUser.id,
    },
    {
      name: 'Natasha Romanoff',
      email: 'natasha@shield-defense.gov',
      phone: '+1 (555) 888-9900',
      company: 'Shield Defense',
      source: 'Referral',
      status: 'Contacted',
      notes: 'Followed up via email with security compliance whitepaper.',
      userId: demoUser.id,
    },
  ];

  for (const lead of initialLeads) {
    await prisma.lead.create({ data: lead });
  }

  console.log(`Seeded ${initialLeads.length} initial leads successfully.`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
