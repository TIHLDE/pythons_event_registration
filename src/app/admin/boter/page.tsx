import { Link } from '@nextui-org/link';
import { Event, EventType, Player, Registrations } from '@prisma/client';
import { subHours, subWeeks } from 'date-fns';

import { prisma } from '~/lib/prisma';
import { FineCreate } from '~/tihlde/fines';

import { FinesAccordion } from '~/components/fines/FinesAccordion';

import { rules } from '~/rules';

const getData = async () => {
  const today = new Date();
  const twoWeeksBack = subWeeks(new Date(), 2);
  const eventsQuery = prisma.event.findMany({
    where: {
      time: {
        gte: twoWeeksBack,
        lte: today,
      },
    },
    include: { registrations: true },
    orderBy: { time: 'desc' },
  });

  const playersQuery = prisma.player.findMany({
    where: {
      active: true,
      disableRegistrations: false,
    },
    orderBy: { name: 'asc' },
  });

  const [events, players] = await Promise.all([eventsQuery, playersQuery]);

  // Need to insert every player if either late registration or no registration
  const eventsWithFines = events
    .filter((event) => event.eventType === EventType.TRAINING || event.eventType === EventType.MATCH)
    .map<EventWithFines | undefined>((event) => {
      const rule = rules[event.eventType];
      if (!rule) {
        return;
      }
      const playersWithoutRegistration = players
        .map<ProposedFineWithDate | undefined>((player) => {
          if (event.teamId && player.teamId !== event.teamId) {
            return;
          }
          // Players shouldn't receive fine if they didn't have an account before the event
          if (player.createdAt > event.time) {
            return;
          }

          const paragraph = rule.paragraph;

          const registration = event.registrations.find((registration) => registration.playerId === player.id);
          if (!registration) {
            const finesAmount = rule.fines.noRegistration;
            return { player: player, reason: 'Ikke registrert seg', amount: finesAmount, description: paragraph };
          }

          const deadline = subHours(event.time, rule.deadlines.signupBefore);
          const finesAmount = rule.fines.tooLateRegistration;

          if (registration.updatedAt && registration.updatedAt > deadline) {
            return {
              player: player,
              reason: 'Oppdaterte registrering for sent',
              time: registration.updatedAt,
              amount: finesAmount,
              description: paragraph,
            };
          }
          if (registration.time > deadline) {
            return {
              player: player,
              reason: 'Registrerte seg for sent',
              time: registration.time,
              amount: finesAmount,
              description: paragraph,
            };
          }
        })
        .filter(Boolean);
      return {
        ...event,
        fines: playersWithoutRegistration as unknown as ProposedFine[],
      };
    })
    .filter(Boolean) as EventWithFines[];
  return { events: eventsWithFines };
};

type ProposedFine = Pick<FineCreate, 'amount' | 'reason' | 'description'> & { player: Player; time?: string };
type ProposedFineWithDate = Omit<ProposedFine, 'time'> & { time?: Date };

export type EventWithFines = Event & {
  registrations: Registrations[];
  fines: ProposedFine[];
};

const Fines = async () => {
  const { events } = await getData();

  return (
    <>
      <p className='text-md my-4'>
        Viser bøter for arrangementer 2 uker tilbake i tid. Bøtene er kalkulert på bakgrunn av{' '}
        <Link href='https://tihlde.org/grupper/pythons-gutter-a/lovverk/' isExternal underline='always'>
          lovverket
        </Link>
        .
      </p>
      <div>
        {!events.length && <p className='text-md'>Ingen bøter å vise</p>}
        <FinesAccordion events={events} />
      </div>
    </>
  );
};

export default Fines;
