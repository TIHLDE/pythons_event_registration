'use client';

import { Team } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { ConfirmModal } from '~/components/ConfirmModal';

export type TeamDeleteProps = {
  team: Team;
};

export const TeamDelete = ({ team }: TeamDeleteProps) => {
  const router = useRouter();
  const deleteTeam = async (id: Team['id']) => {
    await axios.delete(`/api/teams/${id}`);
    router.refresh();
  };
  return (
    <ConfirmModal
      description='Er du helt sikker? Lagets spillere vil ikke berøres, men bli stående uten tilhørighet til et lag.'
      onConfirm={() => deleteTeam(team.id)}
      size='sm'
      title='Slett lag'
      variant='bordered'>
      Slett
    </ConfirmModal>
  );
};
