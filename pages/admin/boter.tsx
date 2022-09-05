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
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { Event, Player } from '@prisma/client';
import axios from 'axios';
import { format, subDays, subHours } from 'date-fns';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import rules from 'rules';
import safeJsonStringify from 'safe-json-stringify';

import { IEvent } from 'types';

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
  const eventsNew = eventsQuery.map((event) => {
    const eventRegistrationsPlayersIds = event.registrations.map((registration) => registration.playerId);
    const playersWithoutRegistration = players.map((player) => {
      if (event.teamId && player.teamId !== event.teamId) {
        return;
      }
      if (!eventRegistrationsPlayersIds.includes(player.id) && player.createdAt < event.time) {
        return { player: player, reason: 'Ikke registrert seg' };
      } else {
        const registration = event.registrations.find((registration) => registration.playerId === player.id);
        if (registration) {
          let deadline;
          if (event.eventTypeSlug === 'trening') {
            deadline = subHours(event.time, rules.deadlineBeforeTraining);
          } else if (event.eventTypeSlug === 'kamp') {
            deadline = subHours(event.time, rules.deadlineBeforeMatch);
          }
          if (deadline) {
            // Need to check if player was created before the deadline
            if (registration.updatedAt && registration.updatedAt > deadline) {
              return {
                player: player,
                reason: `Oppdaterte registrering for sent ${format(registration.updatedAt, 'dd.MM HH:mm')}`,
              };
            }
            if (registration.time > deadline) {
              return {
                player: player,
                reason: `Registrerte seg for sent - ${format(registration.time, 'dd.MM HH:mm')}`,
              };
            }
          }
        }
      }
    });
    return {
      ...event,
      fines: playersWithoutRegistration.filter((registration) => registration?.player),
    };
  });
  const events = JSON.parse(safeJsonStringify(eventsNew));
  return { props: { events } };
};

const Fines: NextPage = ({ events }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState('');

  const handleChange = (panel: string, isExpanded: boolean) => setExpanded(isExpanded ? panel : '');

  const setFinesGiven = async (event: Event, finesGiven: boolean) => {
    await axios.put(`/api/events/${event.id}`, { data: { finesGiven } }).then(() => {
      router.replace(router.asPath);
    });
  };

  return (
    <>
      <Head>
        <title>Bøter - Pythons</title>
      </Head>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h1'>Bøter 😈 👹</Typography>
        <Link href='/admin' passHref>
          <Button component='a' startIcon={<AdminPanelSettingsRoundedIcon />} variant='outlined'>
            Til admin
          </Button>
        </Link>
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
        {events.map((event: IEvent & { fines: { player: Player; reason: string }[] }, idx: number) => (
          <Accordion
            expanded={expanded === `panel${idx}`}
            key={idx}
            onChange={(_, isExpanded) => handleChange(`panel${idx}`, isExpanded)}
            sx={{ backgroundColor: '#3A2056' }}>
            <AccordionSummary aria-controls='panel1bh-content' expandIcon={<ExpandMoreIcon />} id='panel1bh-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                {`${event.finesGiven ? '✅' : '❌'} `}
                {event.title || 'Trening'}
                {'  '}
                {format(new Date(event.time), 'dd.MM HH:mm')}
              </Typography>
              <Typography sx={{ color: 'text.secondary', ml: 1 }}>{event.fines.length} bøter</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <FormControlLabel control={<Checkbox onChange={(e) => setFinesGiven(event, e.target.checked)} value={event.finesGiven} />} label='Gitt bøter' />
              </Box>
              <Grid columnSpacing={1} container rowSpacing={0.5}>
                {event.fines.map((fine, index) => (
                  <Fragment key={fine.player.id}>
                    <Grid item xs={5}>
                      <Typography variant='body1'>{fine.player.name}</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant='body1'>{fine.reason}</Typography>
                    </Grid>
                    {index + 1 !== event.fines.length && (
                      <Grid item xs={12}>
                        <Divider />
                      </Grid>
                    )}
                  </Fragment>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default Fines;
