import { Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { MatchEvent, MatchEventType, Player, Prisma } from '@prisma/client';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { fetcher, MATCH_EVENT_TYPES } from 'utils';

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
  playerId: string | MatchEvent['playerId'];
};

const MatchEvents = ({ event, isAdmin = false }: MatchEventsProps) => {
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      type: MatchEventType.GOAL,
      playerId: '',
    },
  });

  const { data: matchEvents, mutate } = useSWR<Prisma.MatchEventGetPayload<{ include: { player: true } }>[], FormData>(
    `/api/matches/${event.match?.id}/events`,
    fetcher,
  );
  const { data: teamPlayers = [] } = useSWR<Player[]>(`/api/players`, fetcher);

  const onSubmit = async (data: FormData) =>
    axios.post(`/api/matches/${event.match?.id}/events`, { data }).then(() => {
      mutate();
    });

  return (
    <Stack gap={1}>
      {matchEvents && matchEvents.length ? (
        matchEvents.map((matchEvent) => <Typography key={matchEvent.id}>{`${MATCH_EVENT_TYPES[matchEvent.type]} - ${matchEvent.player.name}`}</Typography>)
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
              name='playerId'
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='playerId-label'>Spiller</InputLabel>
                  <Select id='playerId' labelId='playerId-label' required {...field} label='Spiller'>
                    {teamPlayers.map((player) => (
                      <MenuItem key={player.id} value={player.id}>
                        {player.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Stack>
          <Button type='submit' variant='contained'>
            Legg til hendelse
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default MatchEvents;
