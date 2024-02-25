'use client';

import { LeadershipPeriodRole } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { ConfirmModal } from '~/components/ConfirmModal';

export type LeadershipPeriodRoleDeleteProps = {
  id: number;
};

export const LeadershipPeriodRoleDelete = ({ id }: LeadershipPeriodRoleDeleteProps) => {
  const router = useRouter();
  const deleteLeadershipPeriodRole = async (id: LeadershipPeriodRole['id']) => {
    await axios.delete(`/api/leadershiprole/${id}`);
    router.refresh();
  };
  return (
    <ConfirmModal
      description='Er du sikker på at du vil slette rollen fra styret?'
      onConfirm={() => deleteLeadershipPeriodRole(id)}
      title='Slett rolle'
      variant='bordered'>
      Slett rolle
    </ConfirmModal>
  );
};
