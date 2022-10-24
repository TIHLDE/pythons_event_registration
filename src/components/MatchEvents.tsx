import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { MatchEvent, MatchEventType, Player, Position, Prisma } from '@prisma/client';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { fetcher, MATCH_EVENT_TYPES } from 'utils';

import ConfirmModal from 'components/ConfirmModal';

export type MatchEventsProps = {
  isAdmin?: boolean;
  event: Prisma.EventGetPayload<{
    include: {
      type: true;
      team: true;
      match: true;
    };
  }>;
};

type FormData = Pick<MatchEvent, 'type'> & {
  player: Player | null;
};

const MatchEvents = ({ event, isAdmin = false }: MatchEventsProps) => {
  const { handleSubmit, control, watch, formState, setValue } = useForm<FormData>({
    defaultValues: {
      type: MatchEventType.GOAL,
      player: null,
    },
  });

  const selectedPlayer = watch('player');

  const { data: matchEvents, mutate } = useSWR<Prisma.MatchEventGetPayload<{ include: { player: true } }>[], FormData>(
    `/api/matches/${event.match?.id}/events`,
    fetcher,
  );
  const { data: teamPlayers = [], isValidating: isPlayersLoading } = useSWR<Player[]>(`/api/players`, fetcher);
  const { data: positions = [], isValidating: isPositionsLoading } = useSWR<Position[]>('/api/positions', fetcher);

  const onSubmit = async (data: FormData) => {
    if (!data.player) {
      return;
    }
    return axios.post(`/api/matches/${event.match?.id}/events`, { data: { type: data.type, playerId: data.player.id } }).then(() => {
      mutate();
      setValue('player', null);
    });
  };
  const deleteMatchEvent = async (id: MatchEvent['id']) =>
    axios.delete(`/api/matches/${event.match?.id}/events/${id}`).then(() => {
      mutate();
    });

  return (
    <Stack gap={1}>
      {matchEvents && matchEvents.length ? (
        matchEvents.map((matchEvent) => (
          <Typography key={matchEvent.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>{`${MATCH_EVENT_TYPES[matchEvent.type]} - ${matchEvent.player.name}`}</span>
            {isAdmin && (
              <ConfirmModal color='error' onConfirm={() => deleteMatchEvent(matchEvent.id)} size='small' title='Slett hendelse' variant='outlined'>
                Slett
              </ConfirmModal>
            )}
          </Typography>
        ))
      ) : (
        <Typography>Ingen hendelser er registrert</Typography>
      )}
      {isAdmin && (
        <Stack component='form' gap={1} onSubmit={handleSubmit(onSubmit)} sx={{ border: '1px solid white', p: 2, borderRadius: 1 }}>
          <Stack direction='row' gap={1}>
            <Controller
              control={control}
              name='type'
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='type-label'>Hendelse</InputLabel>
                  <Select id='type' labelId='type-label' required {...field} label='Hendelse'>
                    <MenuItem value={MatchEventType.GOAL}>{MATCH_EVENT_TYPES[MatchEventType.GOAL]}</MenuItem>
                    <MenuItem value={MatchEventType.ASSIST}>{MATCH_EVENT_TYPES[MatchEventType.ASSIST]}</MenuItem>
                    <MenuItem value={MatchEventType.RED_CARD}>{MATCH_EVENT_TYPES[MatchEventType.RED_CARD]}</MenuItem>
                    <MenuItem value={MatchEventType.YELLOW_CARD}>{MATCH_EVENT_TYPES[MatchEventType.YELLOW_CARD]}</MenuItem>
                    <MenuItem value={MatchEventType.MOTM}>{MATCH_EVENT_TYPES[MatchEventType.MOTM]}</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name='player'
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  disabled={isPlayersLoading || isPositionsLoading}
                  disablePortal
                  fullWidth
                  getOptionLabel={(option) => option.name}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  groupBy={(option) => option.position}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                  noOptionsText='Fant ingen spillere med dette navnet'
                  onChange={(_, value) => onChange(value)}
                  options={teamPlayers
                    .sort((a, b) => a.positionId - b.positionId)
                    .map((player) => ({ ...player, position: positions.find((pos) => pos.id === player.positionId)?.title || 'Annet' }))}
                  renderInput={(params) => (
                    <TextField
                      sx={{ background: 'transparent', color: 'white' }}
                      {...params}
                      label={isPlayersLoading ? 'Laster spillere...' : 'Velg spiller'}
                    />
                  )}
                  value={value}
                />
              )}
            />
          </Stack>
          <Button disabled={!selectedPlayer || formState.isSubmitting} type='submit' variant='contained'>
            Legg til hendelse
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default MatchEvents;
