'use client';

import { Stack, TypeBackground } from '@mui/material';
import { ExtendedEvent } from 'functions/event';
import { ReactNode } from 'react';

export type EventCardProps = {
  eventDetails: ExtendedEvent;
  children: ReactNode;
};

const EventCard = ({ eventDetails, children }: EventCardProps) => {
  return (
    <Stack
      gap={1}
      sx={{
        background: ({ palette }) => palette.background[eventDetails.eventTypeSlug as keyof TypeBackground],
        width: '100%',
        height: 'auto',
        p: 1,
        borderRadius: 1,
      }}>
      {children}
    </Stack>
  );
};

export default EventCard;
