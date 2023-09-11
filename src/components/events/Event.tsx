import CancelIcon from '@mui/icons-material/Cancel';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { Box, Divider, Tooltip, Typography } from '@mui/material';
import { isPast } from 'date-fns';
import { ExtendedEvent } from 'functions/event';
import { getSignedInUser } from 'functions/getUser';
import { getEventTitle } from 'utils';

import EventCard from 'components/events/EventCard';
import EventRegistration from 'components/events/EventRegistration';
import EventRelatedMatches from 'components/events/EventRelatedMatches';
import MatchModal, { MatchModalProps } from 'components/events/MatchModal';
import PlayersModal from 'components/events/PlayersModal';
import { FormatDate } from 'components/FormatDate';

export type EventProps = {
  eventDetails: ExtendedEvent;
  relatedMatches: MatchModalProps['event'][];
};

const Event = async ({ eventDetails, relatedMatches }: EventProps) => {
  const user = await getSignedInUser();
  const userRegistration = eventDetails.registrations.find((registration) => registration.playerId === user?.id);

  return (
    <EventCard eventDetails={eventDetails}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 1, columnGap: 2 }}>
        <Typography component='span' variant='h3'>
          {getEventTitle(eventDetails).icon}
        </Typography>
        <Typography fontWeight='bold' variant='h3'>
          {getEventTitle(eventDetails).title}
        </Typography>

        <Tooltip title='Tidspunkt'>
          <WatchLaterIcon />
        </Tooltip>
        <Typography sx={{ textTransform: 'capitalize' }} variant='body1'>
          <FormatDate time={eventDetails.time.toJSON()} />
        </Typography>
        <Tooltip title='Sted'>
          <LocationOnIcon />
        </Tooltip>
        <Typography variant='body1'>{eventDetails.location}</Typography>
        {eventDetails.team && (
          <>
            <Tooltip title='Lag'>
              <GroupsRoundedIcon />
            </Tooltip>
            <Typography variant='body1'>{eventDetails.team.name}</Typography>
          </>
        )}

        <Tooltip title='Påmeldt'>
          <CheckRoundedIcon />
        </Tooltip>
        <PlayersModal eventType={eventDetails.eventTypeSlug} registrations={eventDetails?.willArrive || []} title='Påmeldt' />
        <Tooltip title='Avmeldt'>
          <CancelIcon />
        </Tooltip>
        <PlayersModal eventType={eventDetails.eventTypeSlug} registrations={eventDetails?.willNotArrive || []} title='Avmeldt' />
        <Tooltip title='Ikke svart'>
          <QuestionMarkIcon />
        </Tooltip>
        <PlayersModal eventType={eventDetails.eventTypeSlug} registrations={eventDetails?.hasNotResponded || []} title='Ikke svart' />
      </Box>

      {((eventDetails.match && isPast(new Date(eventDetails.time))) || relatedMatches.length > 0) && <Divider sx={{ my: 0.5 }} />}
      {eventDetails.match && isPast(new Date(eventDetails.time)) && <MatchModal event={eventDetails} sx={{ my: -0.5 }} />}
      <EventRelatedMatches relatedMatches={relatedMatches} />
      <Divider sx={{ mt: 0.5 }} />

      <EventRegistration eventDetails={eventDetails} player={user!} registration={userRegistration} />
    </EventCard>
  );
};

export default Event;
