import { Divider, Link as MuiLink, Typography } from '@mui/material';
import { Event, Player, Registrations } from '@prisma/client';
import { subDays, subHours } from 'date-fns';
import { prisma } from 'lib/prisma';
import { rules } from 'rules';
import { FineCreate } from 'tihlde/fines';

import { FineAccordion } from 'components/fines/FineAccordion';

const getData = async () => {
  const today = new Date();
  const twoWeeksBack = subDays(new Date(), 14);
  const eventsQuery = await prisma.event.findMany({
    where: {
      time: {
        gte: twoWeeksBack,
        lte: today,
      },
    },
    include: {
      registrations: true,
    },
    orderBy: {
      time: 'desc',
    },
  });

  const players = await prisma.player.findMany({
    where: {
      active: true,
    },
  });

  // Need to insert every player if either late registration or no registration
  const eventsWithFines = eventsQuery
    .filter((event) => event.eventTypeSlug === 'trening' || event.eventTypeSlug === 'kamp')
    .map<EventWithFines>((event) => {
      const playersWithoutRegistration = players
        .map<ProposedFineWithDate | undefined>((player) => {
          if (event.teamId && player.teamId !== event.teamId) {
            return;
          }
          // Players shouldn't receive fine if they didn't have an account before the event
          if (player.createdAt > event.time) {
            return;
          }
          const rule = rules[event.eventTypeSlug];
          const paragraph = rule.paragraph;

          const registration = event.registrations.find((registration) => registration.playerId === player.id);
          if (!registration) {
            const finesAmount = rules[event.eventTypeSlug].fines.noRegistration;
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
    });
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
      <Divider sx={{ my: 1 }} />
      <Typography>
        Viser bøter for arrangementer 2 uker tilbake i tid. Bøtene er kalkulert på bakgrunn av{' '}
        <MuiLink href='https://tihlde.org/grupper/pythons-gutter-a/lovverk/' rel='noreferrer' target='_blank'>
          lovverket
        </MuiLink>
        .
      </Typography>
      <Divider sx={{ my: 1 }} />
      <div>
        {!events.length && <Typography>Ingen bøter å vise</Typography>}
        {events.map((event, index) => (
          <FineAccordion event={event} key={index} />
        ))}
      </div>
    </>
  );
};

export default Fines;
