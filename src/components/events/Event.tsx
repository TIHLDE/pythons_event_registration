import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { Divider } from '@nextui-org/divider';
import { Tooltip } from '@nextui-org/tooltip';
import { isPast } from 'date-fns';
import { ExtendedEvent } from 'functions/event';
import { getSignedInUser } from 'functions/getUser';
import { Suspense } from 'react';
import { getEventTitle } from 'utils';

import EventCard from 'components/events/EventCard';
import EventRegistration from 'components/events/EventRegistration';
import EventRelatedMatches from 'components/events/EventRelatedMatches';
import EventWeather from 'components/events/EventWeather';
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
      <div className='grid grid-cols-[auto_1fr] gap-x-3 gap-y-2'>
        <span className='text-2xl'>{getEventTitle(eventDetails).icon}</span>
        <h3 className='font-cabin text-2xl font-bold'>{getEventTitle(eventDetails).title}</h3>
        <Tooltip content='Tidspunkt' showArrow>
          <WatchLaterIcon />
        </Tooltip>
        <p className='text-md capitalize'>
          <FormatDate time={eventDetails.time.toJSON()} />
        </p>
        <Tooltip content='Sted' showArrow>
          <LocationOnIcon />
        </Tooltip>
        <p className='text-md'>{eventDetails.location}</p>
        {eventDetails.team && (
          <>
            <Tooltip content='Lag' showArrow>
              <GroupsRoundedIcon />
            </Tooltip>
            <p className='text-md'>{eventDetails.team.name}</p>
          </>
        )}

        <Suspense fallback={null}>
          <EventWeather eventDetails={eventDetails} />
        </Suspense>

        <div className='col-span-2 flex gap-2'>
          <PlayersModal eventType={eventDetails.eventType} registrations={eventDetails?.willArrive || []} title='Påmeldt' />
          <PlayersModal eventType={eventDetails.eventType} registrations={eventDetails?.willNotArrive || []} title='Avmeldt' />
          <PlayersModal eventType={eventDetails.eventType} registrations={eventDetails?.hasNotResponded || []} title='Ikke svart' />
        </div>
      </div>

      {((eventDetails.match && isPast(new Date(eventDetails.time))) || relatedMatches.length > 0) && <Divider />}
      {eventDetails.match && isPast(new Date(eventDetails.time)) && <MatchModal event={eventDetails} />}
      <EventRelatedMatches relatedMatches={relatedMatches} />

      <EventRegistration eventDetails={eventDetails} player={user!} registration={userRegistration} />
    </EventCard>
  );
};

export default Event;
