import { Autocomplete, Button, Dialog, Divider, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { fetcher } from 'utils';

import { IMatch, IPlayer, StatisticType } from 'types';

import CounterButton from './CounterButton';
export type MatchStatsModalProps = {
  open: boolean;
  handleClose: () => void;
  match: IMatch;
};

export type PlayerSelectProps = {
  players: IPlayer[];
  addPlayer: (player: IPlayer | null) => void;
};

const PlayerSelect = ({ players, addPlayer }: PlayerSelectProps) => {
  const [selectedPlayer, setSelectedPlayer] = useState<IPlayer | null>(null);

  const handleConfirm = () => {
    if (selectedPlayer) {
      addPlayer(selectedPlayer);
      setSelectedPlayer(null);
    }
  };
  return (
    <Stack direction={'column'} justifyContent='space-between'>
      <Autocomplete
        disablePortal
        getOptionLabel={(option) => option.name}
        id='combo-box-demo'
        noOptionsText='Fant ingen spillere med dette navnet, kontakt trener-teamet for å bli lagt til'
        onChange={(e, value) => setSelectedPlayer(value)}
        options={players}
        renderInput={(params) => <TextField sx={{ background: 'transparent', color: 'white' }} {...params} label='Velg spiller' />}
        size='small'
        sx={{ width: '100%', maxWidth: 500, color: 'text.primary' }}
        value={selectedPlayer}
      />
      {selectedPlayer && (
        <Button onClick={handleConfirm} variant='outlined'>
          Legg til
        </Button>
      )}
    </Stack>
  );
};

const MatchStatsModal = ({ open, match, handleClose }: MatchStatsModalProps) => {
  const { data: players = [] } = useSWR<IPlayer[]>('/api/players', fetcher);

  const [editMode, setEditMode] = useState(match.result === null);
  const { handleSubmit, control, getValues, setValue, watch } = useForm({
    defaultValues: {
      homeGoals: match.homeGoals || 0,
      awayGoals: match.awayGoals || 0,
      goalScorers: match.statistics?.filter((stat) => stat.statisticType === StatisticType.GOAL).map((stat) => ({ player: stat.player, amount: 0 })) || [],
      assists: match.statistics?.filter((stat) => stat.statisticType === StatisticType.ASSIST).map((stat) => ({ player: stat.player, amount: 0 })) || [],
      yellowCards:
        match.statistics?.filter((stat) => stat.statisticType === StatisticType.YELLOW_CARD).map((stat) => ({ player: stat.player, amount: 0 })) || [],
      redCards: match.statistics?.filter((stat) => stat.statisticType === StatisticType.RED_CARD).map((stat) => ({ player: stat.player, amount: 0 })) || [],
      motm: match.statistics?.filter((stat) => stat.statisticType === StatisticType.MOTM).map((stat) => ({ player: stat.player, amount: 0 })) || [],
    },
  });
  const watchGoalScorer = watch('goalScorers');
  const watchAssist = watch('assists');
  const watchYellowCard = watch('yellowCards');
  const watchRedCard = watch('redCards');
  const watchMotm = watch('motm');

  const addPlayerToGoalScorers = (player: IPlayer | null) => {
    if (player) {
      const newGoalScorers = [...watchGoalScorer, { player, amount: 1 }];
      setValue('goalScorers', newGoalScorers);
    }
  };

  const addPlayerToAssists = (player: IPlayer | null) => {
    if (player) {
      const newAssists = [...watchAssist, { player, amount: 1 }];
      setValue('assists', newAssists);
    }
  };

  const addPlayerToYellowCards = (player: IPlayer | null) => {
    if (player) {
      const newYellowCards = [...watchYellowCard, { player, amount: 1 }];
      setValue('yellowCards', newYellowCards);
    }
  };
  const addPlayerToRedCards = (player: IPlayer | null) => {
    if (player) {
      const newRedCards = [...watchRedCard, { player, amount: 1 }];
      setValue('redCards', newRedCards);
    }
  };
  const addPlayerToMotm = (player: IPlayer | null) => {
    if (player) {
      const newMotm = [...watchMotm, { player, amount: 1 }];
      setValue('motm', newMotm);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ '& .MuiDialog-paper': { width: 400, border: '2px solid #ffffff', p: 4 } }}>
      <Stack spacing={2}>
        <Typography variant='h3'>TIHLDE Pythons - {match.opponent}</Typography>
        {editMode ? (
          <form onSubmit={handleSubmit((data) => console.log(data))}>
            <Stack spacing={2}>
              <Controller
                control={control}
                name={'homeGoals'}
                render={({ field: { onChange, value } }) => <TextField label={'Pythons mål'} onChange={onChange} size='small' type='number' value={value} />}
              />
              <Controller
                control={control}
                name={'awayGoals'}
                render={({ field: { onChange, value } }) => (
                  <TextField label={`${match.opponent} mål`} onChange={onChange} size='small' type='number' value={value} />
                )}
              />
              <Divider />
              <Typography variant='body1'>Statistikk</Typography>
              <Typography variant='body2'>Målscorere</Typography>
              <PlayerSelect addPlayer={addPlayerToGoalScorers} players={players} />
              {getValues().goalScorers.map((player) => (
                <Stack direction='row' justifyContent='space-between' key={player.player.id}>
                  <Typography variant='body2'>{player.player.name}</Typography>
                </Stack>
              ))}
              <Divider />
              <Typography variant='body2'>Assister</Typography>
              <PlayerSelect addPlayer={addPlayerToAssists} players={players} />
              {getValues().assists.map((player) => (
                <Stack direction='row' justifyContent='space-between' key={player.player.id}>
                  <Typography variant='body2'>{player.player.name}</Typography>
                </Stack>
              ))}
              <Divider />
              <Typography variant='body2'>Gult kort</Typography>
              <PlayerSelect addPlayer={addPlayerToYellowCards} players={players} />
              {getValues().yellowCards.map((player) => (
                <Stack direction='row' justifyContent='space-between' key={player.player.id}>
                  <Typography variant='body2'>{player.player.name}</Typography>
                </Stack>
              ))}
              <Divider />
              <Typography variant='body2'>Rødt kort</Typography>
              <PlayerSelect addPlayer={addPlayerToRedCards} players={players} />
              {getValues().redCards.map((player) => (
                <Stack direction='row' justifyContent='space-between' key={player.player.id}>
                  <Typography variant='body2'>{player.player.name}</Typography>
                </Stack>
              ))}
              <Divider />
              <Typography variant='body2'>MOTM</Typography>
              <PlayerSelect addPlayer={addPlayerToMotm} players={players} />
              {getValues().motm.map((player) => (
                <Stack direction='row' justifyContent='space-between' key={player.player.id}>
                  <Typography variant='body2'>{player.player.name}</Typography>
                </Stack>
              ))}
            </Stack>
          </form>
        ) : (
          <p>Testing</p>
        )}
      </Stack>
    </Dialog>
  );
};

export default MatchStatsModal;
