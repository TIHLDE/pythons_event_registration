'use client';

import { ExtendedEvent } from 'functions/event';
import { ReactNode } from 'react';
import { eventTypeBgGradient } from 'utils';

export type EventCardProps = {
  eventDetails: ExtendedEvent;
  children: ReactNode;
};

const EventCard = ({ eventDetails, children }: EventCardProps) => {
  return <div className={`flex h-auto w-full flex-col gap-2 rounded-lg p-3 ${eventTypeBgGradient[eventDetails.eventType]}`}>{children}</div>;
};

export default EventCard;
