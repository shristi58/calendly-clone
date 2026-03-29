import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing existing data...');
  await prisma.answer.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.question.deleteMany();
  await prisma.availabilityOverride.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.eventType.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.oAuthAccount.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Creating user...');
  const password = await bcrypt.hash('password123', 12);

  const user = await prisma.user.create({
    data: {
      name: 'Anand Kumar',
      email: 'mukulanand.dev@gmail.com',
      password,
      timezone: 'Asia/Kolkata',
    },
  });

  console.log('📅 Creating schedule...');
  const schedule = await prisma.schedule.create({
    data: {
      userId: user.id,
      name: 'Working Hours',
      isDefault: true,
    },
  });

  console.log('⏰ Creating availability (Mon-Fri 9:00-17:00)...');
  for (let day = 1; day <= 5; day++) {
    await prisma.availability.create({
      data: { scheduleId: schedule.id, dayOfWeek: day, startTime: '09:00', endTime: '17:00' },
    });
  }

  console.log('📝 Creating event types...');
  const eventType30 = await prisma.eventType.create({
    data: {
      userId: user.id,
      scheduleId: schedule.id,
      name: '30 Min Meeting',
      slug: '30min-meeting',
      description: 'A quick 30-minute meeting to discuss any topic.',
      duration: 30,
      color: '#0069ff',
      bufferBefore: 5,
      bufferAfter: 5,
    },
  });

  await prisma.eventType.create({
    data: {
      userId: user.id,
      scheduleId: schedule.id,
      name: '60 Min Consultation',
      slug: '60min-consultation',
      description: 'An in-depth 60-minute consultation session.',
      duration: 60,
      color: '#7b2ff7',
      bufferBefore: 10,
      bufferAfter: 10,
    },
  });

  await prisma.eventType.create({
    data: {
      userId: user.id,
      scheduleId: schedule.id,
      name: '15 Min Quick Call',
      slug: '15min-quick-call',
      description: 'A brief 15-minute call for quick questions.',
      duration: 15,
      color: '#00c853',
      bufferBefore: 0,
      bufferAfter: 5,
    },
  });

  console.log('❓ Creating custom questions...');
  await prisma.question.create({
    data: {
      eventTypeId: eventType30.id,
      question: 'What would you like to discuss?',
      type: 'textarea',
      required: true,
      order: 0,
    },
  });

  await prisma.question.create({
    data: {
      eventTypeId: eventType30.id,
      question: 'How did you hear about us?',
      type: 'dropdown',
      required: false,
      options: ['Google Search', 'Social Media', 'Friend Referral', 'Other'],
      order: 1,
    },
  });

  console.log('📌 Creating date-specific override...');
  await prisma.availabilityOverride.create({
    data: { scheduleId: schedule.id, date: '2026-03-31', startTime: '10:00', endTime: '14:00' },
  });

  console.log('\n✅ Seeded successfully!');
  console.log('   Login: mukulanand.dev@gmail.com / password123');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
