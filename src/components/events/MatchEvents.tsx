'use client';

import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { MatchEvent, MatchEventType, Player, Prisma } from '@prisma/client';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { MATCH_EVENT_TYPES } from 'utils';

import { useMatchEvents, usePlayers, usePositions } from 'hooks/useQuery';

import ConfirmModal from 'components/ConfirmModal';
import LoadingLogo from 'components/LoadingLogo';

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

  const { data: matchEvents, refetch } = useMatchEvents(event.match?.id ?? -1, { enabled: Boolean(event.match?.id) });
  const { data: players = [], isLoading: isPlayersLoading } = usePlayers({ enabled: isAdmin });
  const { data: positions = [], isLoading: isPositionsLoading } = usePositions();

  const onSubmit = async (data: FormData) => {
    if (!data.player) {
      return;
    }
    await axios.post(`/api/matches/${event.match?.id}/events`, { data: { type: data.type, playerId: data.player.id } });
    refetch();
    setValue('player', null);
  };
  const deleteMatchEvent = async (id: MatchEvent['id']) => {
    await axios.delete(`/api/matches/${event.match?.id}/events/${id}`);
    refetch();
  };

  return (
    <Stack gap={1}>
      {matchEvents ? (
        matchEvents.length ? (
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
        )
      ) : (
        <LoadingLogo />
      )}
      {isAdmin && (
        <Stack
          component='form'
          gap={1}
          onSubmit={handleSubmit(onSubmit)}
          sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
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
                  options={players
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
