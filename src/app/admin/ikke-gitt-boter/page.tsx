import { Divider } from '@nextui-org/divider';
import { Link } from '@nextui-org/link';
import { Fragment } from 'react';

import type { TIHLDEUser } from '~/tihlde';
import { getAllnotPayedFines } from '~/tihlde/fines';
import { getAllPythonsMemberships } from '~/tihlde/memberships';

const getData = async () => {
  const [{ results: memberships }, { results: notPayedFines }] = await Promise.all([getAllPythonsMemberships(), getAllnotPayedFines()]);
  const users = memberships.map((membership) => membership.user);

  const usersWithNoCreatedFines = users.filter((user) => !notPayedFines.some((fine) => fine.created_by.user_id === user.user_id));
  const players: Array<TIHLDEUser> = usersWithNoCreatedFines.map((user) => ({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
  }));
  return { players };
};

const PlayersWithNoCreatedFines = async () => {
  const { players } = await getData();
  return (
    <>
      <p className='text-md mb-4'>
        Viser navn på spillere som skal motta bot for brudd på paragraf <i>§11 - Snitches don&apos;t get stitches</i> på bakgrunn av{' '}
        <Link href='https://tihlde.org/grupper/pythons-gutter-a/lovverk/' isExternal underline='always'>
          lovverket
        </Link>
        .
      </p>
      {!players.length && <p className='text-md'>Alle medlemmer av TIHLDE Pythons har gitt minst 1 bot til enten seg selv eller en annen</p>}
      <div className='flex flex-col gap-2'>
        {players.map((player, index) => (
          <Fragment key={player.user_id}>
            <p className='text-md'>{`${player.first_name} ${player.last_name}`}</p>
            {index !== players.length - 1 && <Divider />}
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default PlayersWithNoCreatedFines;
