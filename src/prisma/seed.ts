/* eslint-disable no-restricted-imports */
import { EventType, Position } from '@prisma/client';
import { addDays, set, subDays } from 'date-fns';

import { prisma } from '../lib/prisma';
import { IS_PRODUCTION, MOCK_TIHLDE_USER_ID } from '../values';

/**
 * Seed the database with data for local development
 */
async function seed() {
  if (IS_PRODUCTION) {
    throw Error('Seeding should not happen in production!');
  }

  console.log('🌱 Seeding...');
  console.time(`🌱 Database has been seeded`);

  console.time('🧹 Cleaned up the database...');
  await prisma.player.deleteMany();
  await prisma.event.deleteMany();
  await prisma.match.deleteMany();
  await prisma.matchEvent.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.player.deleteMany();
  await prisma.registrations.deleteMany();
  await prisma.team.deleteMany();
  console.timeEnd('🧹 Cleaned up the database...');

  console.time('👨‍👨‍👦‍👦 Created teams...');
  await prisma.team.createMany({
    data: [
      { id: 1, name: 'TSFF' },
      { id: 2, name: '7dentligaen' },
    ],
  });
  console.timeEnd('👨‍👨‍👦‍👦 Created teams...');

  console.time('👤 Created players...');
  await prisma.player.createMany({
    data: [
      {
        name: 'Ola Normann',
        tihlde_user_id: MOCK_TIHLDE_USER_ID ?? '~/tihlde_user_id',
        position: Position.KEEPER,
        teamId: 1,
        createdAt: subDays(new Date(), 14),
      },
      {
        name: 'Per Person',
        tihlde_user_id: 'per_user_id',
        position: Position.BACK,
        teamId: 1,
        createdAt: subDays(new Date(), 15),
      },
      {
        name: 'Trond Trondsen',
        tihlde_user_id: 'trond_user_id',
        position: Position.CENTER_BACK,
        teamId: 1,
        createdAt: subDays(new Date(), 16),
      },
      {
        name: 'Jon Johnsen',
        tihlde_user_id: 'jon_user_id',
        position: Position.MIDTFIELDER,
        teamId: 2,
        createdAt: subDays(new Date(), 17),
      },
      {
        name: 'Arne Arne',
        tihlde_user_id: 'arne_user_id',
        position: Position.WINGER,
        teamId: 2,
        disableRegistrations: true,
        createdAt: subDays(new Date(), 18),
      },
    ],
  });
  console.timeEnd('👤 Created players...');

  console.time('🎭 Created events...');
  await prisma.event.createMany({
    data: [
      { eventType: EventType.TRAINING, location: 'Eberg', time: set(addDays(new Date(), -1), { hours: 19, minutes: 0, seconds: 0 }), finesGiven: true },
      { eventType: EventType.TRAINING, location: 'Eberg', time: set(addDays(new Date(), 2), { hours: 19, minutes: 0, seconds: 0 }) },
      { eventType: EventType.TRAINING, location: 'Eberg', time: set(addDays(new Date(), 7), { hours: 19, minutes: 0, seconds: 0 }) },
      { eventType: EventType.TRAINING, location: 'Eberg', time: set(addDays(new Date(), 10), { hours: 20, minutes: 0, seconds: 0 }) },
      { eventType: EventType.SOCIAL, location: 'The Mint', time: set(addDays(new Date(), 20), { hours: 20, minutes: 0, seconds: 0 }), title: 'Voooors' },
    ],
  });
  await prisma.event.create({
    data: {
      eventType: EventType.MATCH,
      location: 'Tempe',
      time: set(addDays(new Date(), 14), { hours: 12, minutes: 0, seconds: 0 }),
      title: 'Datakamperatene',
      teamId: 1,
      match: {
        create: {
          homeGoals: 0,
          awayGoals: 0,
          team: {
            connect: { id: 1 },
          },
        },
      },
    },
  });
  await prisma.event.create({
    data: {
      eventType: EventType.MATCH,
      location: 'Eberg bane C',
      time: set(addDays(new Date(), 15), { hours: 12, minutes: 0, seconds: 0 }),
      title: 'Pareto',
      teamId: 2,
      match: {
        create: {
          homeGoals: 0,
          awayGoals: 0,
          team: {
            connect: { id: 2 },
          },
        },
      },
    },
  });
  console.timeEnd('🎭 Created events...');

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
