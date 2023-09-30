'use client';

import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { Select, SelectItem, SelectSection } from '@nextui-org/select';
import { MatchEvent, MatchEventType, Player, Prisma } from '@prisma/client';
import axios from 'axios';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MATCH_EVENT_TYPES, positionsList } from 'utils';

import { useMatchEvents, usePlayers } from 'hooks/useQuery';

import ConfirmModal from 'components/ConfirmModal';
import LoadingLogo from 'components/LoadingLogo';

export type MatchEventsProps = {
  isAdmin?: boolean;
  event: Prisma.EventGetPayload<{
    include: {
      team: true;
      match: true;
    };
  }>;
};

type FormData = Pick<MatchEvent, 'type'> & {
  player: Player['id'] | null;
};

const MatchEvents = ({ event, isAdmin = false }: MatchEventsProps) => {
  const { handleSubmit, control, watch, formState, setValue } = useForm<FormData>({
    defaultValues: {
      type: MatchEventType.GOAL,
      player: null,
    },
  });

  const selectedPlayer = watch('player');

  const { data: matchEvents, refetch } = useMatchEvents(event.match?.id ?? -1, { enabled: Boolean(event.match?.id) });
  const { data: players = [], isLoading: isPlayersLoading } = usePlayers({ enabled: isAdmin });

  const playersByPosition = useMemo(
    () =>
      positionsList.map((position) => ({
        type: position.type,
        label: position.label,
        players: players.filter((player) => player.position === position.type),
      })),
    [players],
  );

  const onSubmit = async (data: FormData) => {
    if (!data.player) {
      return;
    }
    await axios.post(`/api/matches/${event.match?.id}/events`, { data: { type: data.type, playerId: Number(data.player) } });
    refetch();
    setValue('player', null);
  };
  const deleteMatchEvent = async (id: MatchEvent['id']) => {
    await axios.delete(`/api/matches/${event.match?.id}/events/${id}`);
    refetch();
  };

  return (
    <div className='flex flex-col gap-2'>
      {matchEvents ? (
        matchEvents.length ? (
          matchEvents.map((matchEvent) => (
            <p className='text-md flex items-center gap-2' key={matchEvent.id}>
              <span>{`${MATCH_EVENT_TYPES[matchEvent.type]} - ${matchEvent.player.name}`}</span>
              {isAdmin && (
                <ConfirmModal onConfirm={() => deleteMatchEvent(matchEvent.id)} size='sm' title='Slett hendelse' variant='bordered'>
                  Slett
                </ConfirmModal>
              )}
            </p>
          ))
        ) : (
          <p className='text-md'>Ingen hendelser er registrert</p>
        )
      ) : (
        <LoadingLogo />
      )}
      {isAdmin && (
        <Card as='form' className='flex flex-col gap-2 rounded-md p-4' isBlurred onSubmit={handleSubmit(onSubmit)}>
          <div className='flex gap-2'>
            <Controller
              control={control}
              name='type'
              render={({ field: { onChange, value } }) => (
                <Select label='Hendelse' onChange={(e) => onChange(e.target.value)} selectedKeys={new Set(value ? [value] : [])} variant='faded'>
                  <SelectItem key={MatchEventType.GOAL} value={MatchEventType.GOAL}>
                    {MATCH_EVENT_TYPES[MatchEventType.GOAL]}
                  </SelectItem>
                  <SelectItem key={MatchEventType.ASSIST} value={MatchEventType.ASSIST}>
                    {MATCH_EVENT_TYPES[MatchEventType.ASSIST]}
                  </SelectItem>
                  <SelectItem key={MatchEventType.RED_CARD} value={MatchEventType.RED_CARD}>
                    {MATCH_EVENT_TYPES[MatchEventType.RED_CARD]}
                  </SelectItem>
                  <SelectItem key={MatchEventType.YELLOW_CARD} value={MatchEventType.YELLOW_CARD}>
                    {MATCH_EVENT_TYPES[MatchEventType.YELLOW_CARD]}
                  </SelectItem>
                  <SelectItem key={MatchEventType.MOTM} value={MatchEventType.MOTM}>
                    {MATCH_EVENT_TYPES[MatchEventType.MOTM]}
                  </SelectItem>
                </Select>
              )}
            />
            <Controller
              control={control}
              name='player'
              render={({ field: { onChange, value } }) => (
                <Select
                  isDisabled={isPlayersLoading}
                  label={isPlayersLoading ? 'Laster spillere...' : 'Velg spiller'}
                  onChange={(e) => onChange(e.target.value)}
                  required
                  selectedKeys={new Set(value ? [value] : [])}
                  variant='faded'>
                  {playersByPosition.map((position) => (
                    <SelectSection key={position.type} showDivider title={position.label}>
                      {position.players.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name}
                        </SelectItem>
                      ))}
                    </SelectSection>
                  ))}
                </Select>
              )}
            />
          </div>
          <Button color='primary' isDisabled={!selectedPlayer || formState.isSubmitting} type='submit' variant='solid'>
            Legg til hendelse
          </Button>
        </Card>
      )}
    </div>
  );
};

export default MatchEvents;
