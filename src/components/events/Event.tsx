import { Divider } from '@nextui-org/divider';
import { Tooltip } from '@nextui-org/tooltip';
import { isPast } from 'date-fns';
import { Suspense } from 'react';
import { MdLocationOn, MdOutlineGroups, MdWatchLater } from 'react-icons/md';

import { ExtendedEvent } from '~/functions/event';
import { getSignedInUser } from '~/functions/getUser';

import EventRegistration from '~/components/events/EventRegistration';
import EventRelatedMatches from '~/components/events/EventRelatedMatches';
import EventWeather from '~/components/events/EventWeather';
import MatchModal, { MatchModalProps } from '~/components/events/MatchModal';
import PlayersModal from '~/components/events/PlayersModal';
import { FormatDate } from '~/components/FormatDate';

import { eventTypeBgGradient, getEventTitle } from '~/utils';

export type EventProps = {
  eventDetails: ExtendedEvent;
  relatedMatches: MatchModalProps['event'][];
};

const Event = async ({ eventDetails, relatedMatches }: EventProps) => {
  const user = await getSignedInUser();
  const userRegistration = eventDetails.registrations.find((registration) => registration.playerId === user?.id);

  return (
    <div className={`flex h-auto w-full flex-col gap-2 rounded-lg p-3 ${eventTypeBgGradient[eventDetails.eventType]}`}>
      <div className='grid grid-cols-[auto_1fr] gap-x-3 gap-y-2'>
        <span className='text-2xl'>{getEventTitle(eventDetails).icon}</span>
        <h3 className='font-cabin text-2xl font-bold'>{getEventTitle(eventDetails).title}</h3>
        <Tooltip content='Tidspunkt' showArrow>
          <MdWatchLater className='h-6 w-6' />
        </Tooltip>
        <p className='text-md capitalize'>
          <FormatDate time={eventDetails.time.toJSON()} />
        </p>
        <Tooltip content='Sted' showArrow>
          <MdLocationOn className='h-6 w-6' />
        </Tooltip>
        <p className='text-md'>{eventDetails.location}</p>
        {eventDetails.team && (
          <>
            <Tooltip content='Lag' showArrow>
              <MdOutlineGroups className='h-6 w-6' />
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
    </div>
  );
};

export default Event;
