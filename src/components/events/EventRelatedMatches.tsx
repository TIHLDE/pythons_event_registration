'use client';

import { Button } from '@nextui-org/button';
import { TRANSITION_VARIANTS } from '@nextui-org/framer-transitions';
import { useDisclosure } from '@nextui-org/use-disclosure';
import { motion, useWillChange } from 'framer-motion';
import { useCallback } from 'react';
import { stats } from 'stats';

import MatchModal, { MatchModalProps } from 'components/events/MatchModal';

export type EventRelatedMatchesProps = {
  relatedMatches: MatchModalProps['event'][];
};

const EventRelatedMatches = ({ relatedMatches }: EventRelatedMatchesProps) => {
  const { isOpen, onOpenChange } = useDisclosure();

  const willChange = useWillChange();

  const toggleShowPreviousMatches = useCallback(() => {
    onOpenChange();
    stats.event(`Show previous matches`);
  }, [onOpenChange]);

  if (relatedMatches.length === 0) {
    return null;
  }

  return (
    <div className='flex flex-col'>
      <Button onClick={toggleShowPreviousMatches} variant='light'>
        {isOpen ? 'Skjul' : 'Vis'} tidligere oppgjør
      </Button>
      <motion.div
        animate={isOpen ? 'enter' : 'exit'}
        exit='exit'
        initial='exit'
        style={{ overflowY: 'hidden', willChange }}
        variants={TRANSITION_VARIANTS.collapse}>
        <div>
          {relatedMatches.map((relatedMatch) => (
            <MatchModal className='mt-2' event={relatedMatch} key={relatedMatch.id} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EventRelatedMatches;
