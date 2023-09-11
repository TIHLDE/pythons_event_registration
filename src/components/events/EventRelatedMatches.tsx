'use client';

import { Button, Collapse, Stack } from '@mui/material';
import { useCallback, useState } from 'react';
import { stats } from 'stats';

import MatchModal, { MatchModalProps } from 'components/events/MatchModal';

export type EventRelatedMatchesProps = {
  relatedMatches: MatchModalProps['event'][];
};

const EventRelatedMatches = ({ relatedMatches }: EventRelatedMatchesProps) => {
  const [showPreviousMatches, setShowPreviousMatches] = useState(false);

  const toggleShowPreviousMatches = useCallback(() => {
    setShowPreviousMatches((prev) => !prev);
    stats.event(`Show previous matches`);
  }, []);

  return (
    <>
      {relatedMatches.length > 0 && (
        <Stack gap={0.5}>
          <Button color='menu' onClick={toggleShowPreviousMatches}>
            {showPreviousMatches ? 'Skjul' : 'Vis'} tidligere oppgjør
          </Button>
          <Collapse in={showPreviousMatches} mountOnEnter unmountOnExit>
            {relatedMatches.map((relatedMatch) => (
              <MatchModal event={relatedMatch} key={relatedMatch.id} />
            ))}
          </Collapse>
        </Stack>
      )}
    </>
  );
};

export default EventRelatedMatches;
