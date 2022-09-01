import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, Grid, Link as MuiLink, Stack, Typography } from '@mui/material';
import { format, subDays, subHours } from 'date-fns';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import rules from 'rules';
import safeJsonStringify from 'safe-json-stringify';

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
  });

  const players = await prisma.player.findMany({
    where: {
      active: true,
    },
  });

  // Need to insert every player if either late registration or no registration

  const eventsNew = eventsQuery.map((event) => {
    const eventsRegistrationIds = event.registrations.map((registration) => registration.playerId);
    const playersWithoutRegistration = players.map((player) => {
      if (!eventsRegistrationIds.includes(player.id) && player.createdAt < event.time) {
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
  const [expanded, setExpanded] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (panel: any) => (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <>
      <Head>
        <title>Bøter - Pythons</title>
      </Head>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h2'>Bøter 😈 👹</Typography>
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
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {events.map((event: any, idx: number) => (
          <Accordion expanded={expanded === `panel${idx}`} key={idx} onChange={handleChange(`panel${idx}`)}>
            <AccordionSummary aria-controls='panel1bh-content' expandIcon={<ExpandMoreIcon />} id='panel1bh-header'>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                {event.title || 'Trening'}
                {'  '}
                {format(new Date(event.time), 'dd.MM HH:mm')}
              </Typography>
              <Typography sx={{ color: 'text.secondary', ml: 1 }}>{event.fines.length} bøter</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {event.fines.map((fine: any, index: number) => (
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
