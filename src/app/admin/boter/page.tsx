import { Link } from '@nextui-org/link';
import { Event, EventType, Player, Registrations } from '@prisma/client';
import { subHours, subWeeks } from 'date-fns';

import { prismaClient } from '~/prismaClient';
import { FineCreate } from '~/tihlde/fines';

import { FinesAccordion } from '~/components/fines/FinesAccordion';

import { ACTIVE_CLUB } from '~/values';

const getData = async () => {
  const today = new Date();
  const twoWeeksBack = subWeeks(new Date(), 2);
  const eventsQuery = prismaClient.event.findMany({
    where: {
      time: {
        gte: twoWeeksBack,
        lte: today,
      },
    },
    include: { registrations: true },
    orderBy: { time: 'desc' },
  });

  const playersQuery = prismaClient.player.findMany({
    where: {
      active: true,
      disableRegistrations: false,
    },
    orderBy: { name: 'asc' },
  });

  const [events, players] = await Promise.all([eventsQuery, playersQuery]);

  const eventsWithFines = events
    .map<EventWithFines | undefined>((event) => {
      const rule = ACTIVE_CLUB.rules[event.eventType];
      if (!rule) {
        return;
      }
      const playersWithFine = players
        .map<ProposedFineWithDate | undefined>((player) => {
          if (event.teamId && player.teamId !== event.teamId) {
            return;
          }
          // Players shouldn't receive fine if they didn't have an account before the event
          if (player.createdAt > event.time) {
            return;
          }

          const registration = event.registrations.find((registration) => registration.playerId === player.id);
          if (!registration) {
            const fine = rule.fines.noRegistration;
            return { player, reason: 'Ikke registrert seg', amount: fine.amount, description: fine.paragraph };
          }

          const deadline = subHours(event.time, rule.deadlines.signupBefore);
          const registrationDate = registration.updatedAt ?? registration.time;

          if (registrationDate > deadline) {
            const reasonPrefix = registration.updatedAt ? 'Oppdaterte registrering' : 'Registrerte seg';
            if (!registration.willArrive && rule.fines.tooLateRegistrationNotAttending) {
              return {
                player,
                reason: `${reasonPrefix} for sent og kommer ikke`,
                time: registrationDate,
                amount: rule.fines.tooLateRegistrationNotAttending.amount,
                description: rule.fines.tooLateRegistrationNotAttending.paragraph,
              };
            }
            return {
              player,
              reason: `${reasonPrefix} for sent`,
              time: registrationDate,
              amount: rule.fines.tooLateRegistration.amount,
              description: rule.fines.tooLateRegistration.paragraph,
            };
          }

          if (!registration.willArrive && rule.fines.registrationNotAttending) {
            return {
              player,
              reason: `Kommer ikke`,
              time: registrationDate,
              amount: rule.fines.registrationNotAttending.amount,
              description: rule.fines.registrationNotAttending.paragraph,
            };
          }
        })
        .filter(Boolean);
      return {
        ...event,
        fines: playersWithFine as unknown as ProposedFine[],
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
        <Link href={`https://tihlde.org/grupper/${ACTIVE_CLUB.pythonsGroupSlug}/lovverk/`} isExternal underline='always'>
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
