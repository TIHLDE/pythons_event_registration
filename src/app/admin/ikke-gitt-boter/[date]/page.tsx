import { Divider } from '@nextui-org/divider';
import { Link } from '@nextui-org/link';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Fragment } from 'react';

import { PageProps } from '~/types';

import type { TIHLDEUser } from '~/tihlde';
import { getAllFinesSinceDate } from '~/tihlde/fines';
import { getAllPythonsMemberships } from '~/tihlde/memberships';

import { ACTIVE_CLUB } from '~/values';

const getData = async ({ params }: Pick<PageProps<{ date: string }>, 'params'>) => {
  const sinceDate = new Date(params.date);
  const [{ results: memberships }, { results: fines }] = await Promise.all([getAllPythonsMemberships(), getAllFinesSinceDate(sinceDate)]);
  const users = memberships.map((membership) => membership.user);

  const createdFinesPerUser = users.reduce<Record<TIHLDEUser['user_id'], number>>(
    (prev, user) => ({ ...prev, [user.user_id]: fines.filter((fine) => fine.created_by.user_id === user.user_id).length }),
    {},
  );
  const usersWithNoCreatedFines = users.filter((user) => !createdFinesPerUser[user.user_id]);
  const players: Array<TIHLDEUser> = usersWithNoCreatedFines.map((user) => ({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
  }));
  const finesGiven = fines.length;
  const averageAmountOfFinesGiven = Math.round((finesGiven / (users.length - players.length)) * 1000) / 1000;
  const averageFineSize = Math.round((fines.reduce((prev, curr) => prev + curr.amount, 0) / finesGiven) * 1000) / 1000;
  return { players, sinceDate, finesGiven, averageAmountOfFinesGiven, averageFineSize };
};

const PlayersWithNoCreatedFines = async ({ params }: PageProps<{ date: string }>) => {
  const { players, sinceDate, finesGiven, averageAmountOfFinesGiven, averageFineSize } = await getData({ params });
  return (
    <>
      <p className='text-md mb-4'>
        Viser navn på spillere som skal motta bot for brudd på paragraf <i>§11 - Snitches don&apos;t get stitches</i> på bakgrunn av{' '}
        <Link href={`https://tihlde.org/grupper/${ACTIVE_CLUB.pythonsGroupSlug}/lovverk/`} isExternal underline='always'>
          lovverket
        </Link>{' '}
        siden {format(sinceDate, 'dd. MMMM yyyy', { locale: nb })}.
      </p>
      {players.length > 0 ? (
        <div className='flex flex-col gap-2'>
          <p className='text-md'>
            Det har opprettet {finesGiven} bøter totalt. I snitt har hver spiller som har opprettet én eller flere bøter opprettet {averageAmountOfFinesGiven}{' '}
            bøter. Gjennomsnittsstørrelsen på hver bot er {averageFineSize} bøter.
          </p>
          {players.map((player, index) => (
            <Fragment key={player.user_id}>
              <p className='text-md'>{`${player.first_name} ${player.last_name}`}</p>
              {index !== players.length - 1 && <Divider />}
            </Fragment>
          ))}
        </div>
      ) : (
        <p className='text-md'>Alle medlemmer av TIHLDE Pythons har gitt minst 1 bot til enten seg selv eller en annen</p>
      )}
    </>
  );
};

export default PlayersWithNoCreatedFines;
