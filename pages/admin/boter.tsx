import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Grid from "@mui/material/Grid";
import { prisma } from "lib/prisma";
import safeJsonStringify from "safe-json-stringify";
import { subDays, format, subHours } from "date-fns";
import rules from "rules";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import Head from "next/head";
import { Divider } from "@mui/material";

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
    const eventsRegistrationIds = event.registrations.map(
      (registration) => registration.playerId
    );
    const playersWithoutRegistration = players.map((player) => {
      if (!eventsRegistrationIds.includes(player.id)) {
        return { player: player, reason: "Ikke registrert seg" };
      } else {
        const registration = event.registrations.find(
          (registration) => registration.playerId === player.id
        );
        if (registration) {
          let deadline;
          if (event.eventTypeSlug === "trening") {
            deadline = subHours(event.time, rules.deadlineBeforeTraining);
          } else if (event.eventTypeSlug === "kamp") {
            deadline = subHours(event.time, rules.deadlineBeforeMatch);
          }
          if (deadline) {
            if (registration.updatedAt && registration.updatedAt > deadline) {
              return {
                player: player,
                reason: `Oppdaterte registrering for sent ${format(
                  registration.updatedAt,
                  "dd.MM HH:mm"
                )}`,
              };
            }
            if (registration.time > deadline) {
              return {
                player: player,
                reason: `Registrerte seg for sent - ${format(
                  registration.time,
                  "dd.MM HH:mm"
                )}`,
              };
            }
          }
        }
      }
    });
    return {
      ...event,
      fines: playersWithoutRegistration.filter(
        (registration) => registration?.player
      ),
    };
  });
  const events = JSON.parse(safeJsonStringify(eventsNew));
  return { props: { events } };
};

const Fines: NextPage = ({
  events,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [expanded, setExpanded] = useState("");
  const router = useRouter();
  const handleChange = (panel: any) => (_: any, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <>
      <Head>
        <title>Bøter - Pythons</title>
      </Head>
      <Typography textAlign={"center"} variant="h4" sx={{ marginTop: "2rem" }}>
        Bøter 😈 👹
      </Typography>
      <Button onClick={() => router.push("/admin")}>
        Tilbake til admin-side
      </Button>
      <Typography>
        Viser bøter for arrangementer 2 uker tilbake i tid
      </Typography>
      <Divider sx={{ width: "100%", backgroundColor: "white" }} />
      {!events.length && <Typography>Ingen bøter å vise</Typography>}
      {events.map((event: any, idx: any) => (
        <Accordion
          expanded={expanded === `panel${idx}`}
          onChange={handleChange(`panel${idx}`)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              {event.title || "Trening"}
              {"  "}
              {format(new Date(event.time), "dd.MM HH:mm")}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {event.fines.length} bøter
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container>
              {event.fines.map((fine: any) => (
                <>
                  <Grid item xs={4}>
                    <Typography variant="body1">{fine.player.name}</Typography>
                    <Divider color="rgba(255, 255, 0,1.0)" />
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{fine.reason}</Typography>
                    <Divider color="rgba(255, 255, 0,1.0)" />
                  </Grid>
                </>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default Fines;
