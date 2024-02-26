'use client';

import { LeadershipPeriod } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { ConfirmModal } from '~/components/ConfirmModal';

export type LeadershipPeriodDeleteProps = {
  id: number;
};

export const LeadershipPeriodDelete = ({ id }: LeadershipPeriodDeleteProps) => {
  const router = useRouter();
  const deleteLeadershipPeriod = async (id: LeadershipPeriod['id']) => {
    await axios.delete(`/api/leadershipperiod/${id}`);
    router.refresh();
  };
  return (
    <ConfirmModal
      description='Er du sikker på at du vil slette styret og alle tilhørende roller?'
      onConfirm={() => deleteLeadershipPeriod(id)}
      title='Slett styre'
      variant='bordered'>
      Slett styre
    </ConfirmModal>
  );
};
