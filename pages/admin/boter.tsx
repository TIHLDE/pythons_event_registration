import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { Event, Player, Registrations } from '@prisma/client';
import axios from 'axios';
import { format, subDays, subHours } from 'date-fns';
import { nb } from 'date-fns/locale';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useState } from 'react';
import { rules } from 'rules';
import safeJsonStringify from 'safe-json-stringify';
import { FineCreate } from 'tihlde/fines';

export const getServerSideProps: GetServerSideProps = async () => {
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
  const events = JSON.parse(safeJsonStringify(eventsWithFines));
  return { props: { events } };
};

type ProposedFine = Pick<FineCreate, 'amount' | 'reason' | 'description'> & { player: Player; time?: string };
type ProposedFineWithDate = Omit<ProposedFine, 'time'> & { time?: Date };

type EventWithFines = Event & {
  registrations: Registrations[];
  fines: ProposedFine[];
};

const formatTime = (time: string) =>
  format(new Date(time), "EEEE dd. MMMM' 'HH:mm", {
    locale: nb,
  });

const Fines = ({ events }: { events: EventWithFines[] }) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState('');
  const handleChange = (panel: string, isExpanded: boolean) => setExpanded(isExpanded ? panel : '');

  const getEventTitle = useCallback((event: EventWithFines) => `${event.title || 'Trening'} ${formatTime(event.time as unknown as string)}`, []);

  const setFinesGiven = useCallback(
    async (event: EventWithFines, finesGiven: boolean) => {
      await axios.put(`/api/events/${event.id}`, { data: { finesGiven } });
      router.replace(router.asPath, undefined, { scroll: false });
    },
    [router],
  );

  const autoGiveFines = useCallback(
    async (event: EventWithFines) => {
      const fines: FineCreate[] = event.fines.map((fine) => ({
        amount: fine.amount,
        description: fine.description,
        user: [fine.player.tihlde_user_id],
        image: null,
        reason: `${getEventTitle(event)}: ${fine.reason} ${fine.time ? `(${formatTime(fine.time)})` : ''}`,
      }));
      await axios.post(`/api/give-fines`, { data: { fines, eventId: event.id } });
      router.replace(router.asPath, undefined, { scroll: false });
    },
    [getEventTitle, router],
  );

  return (
    <>
      <Head>
        <title>Bøter - Pythons</title>
      </Head>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h1'>Bøter 😈 👹</Typography>
        <Button color='secondary' component={Link} href='/admin' startIcon={<AdminPanelSettingsRoundedIcon />} variant='outlined'>
          Til admin
        </Button>
      </Stack>
      <Typography sx={{ mb: 1 }}>
        Viser bøter for arrangementer 2 uker tilbake i tid. Bøtene er kalkulert på bakgrunn av{' '}
        <MuiLink href='https://tihlde.org/grupper/pythons-gutter-a/lovverk/' rel='noreferrer' target='_blank'>
          lovverket
        </MuiLink>
        .
      </Typography>
      <div>
        {!events.length && <Typography>Ingen bøter å vise</Typography>}
        {events.map((event, idx: number) => (
          <Accordion
            expanded={expanded === `panel${idx}`}
            key={idx}
            onChange={(_, isExpanded) => handleChange(`panel${idx}`, isExpanded)}
            sx={{ backgroundColor: '#3A2056' }}>
            <AccordionSummary aria-controls='panel1bh-content' expandIcon={<ExpandMoreIcon />} id='panel1bh-header'>
              <Typography>
                {`${event.finesGiven ? '✅' : '❌'} `}
                {getEventTitle(event)}
                <Typography component='span' sx={{ color: 'text.secondary', ml: 4 }}>
                  {event.fines.length} spillere
                </Typography>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction='row' gap={2} sx={{ mb: 2 }}>
                <Button color='info' disabled={event.finesGiven} onClick={() => autoGiveFines(event)} variant='contained'>
                  Gi bøter automagisk
                </Button>
                <FormControlLabel
                  control={<Checkbox checked={event.finesGiven} onChange={(e) => setFinesGiven(event, e.target.checked)} />}
                  label='Gitt bøter'
                />
              </Stack>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 0.5, columnGap: 2 }}>
                {event.fines.map((fine, index) => (
                  <Fragment key={fine.player.id}>
                    <Typography variant='body1'>{fine.player.name}</Typography>
                    <Typography variant='body1'>
                      <>{`${fine.reason} - ${fine.amount} bøter ${fine.time ? `(${formatTime(fine.time)})` : ''}`}</>
                    </Typography>
                    {index + 1 !== event.fines.length && <Divider sx={{ gridColumn: 'span 2' }} />}
                  </Fragment>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default Fines;
