import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { IMatch, Result } from 'types';

export type MatchStatsProps = {
  match: IMatch;
};

const MatchStats = ({ match }: MatchStatsProps) => {
  const [resultValue, setResultValue] = useState('');
  const [editResult, setEditResult] = useState(match.result === null);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 3) {
      return;
    } else if (event.target.value.length === 1) {
      setResultValue(event.target.value + '-');
    } else {
      setResultValue(event.target.value);
    }
  };

  const addResult = async () => {
    await axios.put(`/api/match/${match.id}`, {
      data: { result: resultValue },
    });
    setEditResult(false);
    router.replace(router.asPath);
  };
  return (
    <>
      <Box borderLeft='4px solid #BB86FC' key={match.id} paddingLeft={1}>
        <Typography>TIHLDE Pythons - {match.opponent}</Typography>
        <Stack direction='row' gap={2} sx={{ marginTop: 1 }}>
          {!editResult ? (
            <>
              <Typography>
                {match.homeGoals} - {match.awayGoals}
              </Typography>
              <Button onClick={() => setEditResult(true)} size='small' variant='outlined'>
                Rediger resultat
              </Button>
            </>
          ) : (
            <>
              <TextField label='Resultat' onChange={handleChange} size='small' value={resultValue} />
              {resultValue.length === 3 && (
                <Button onClick={addResult} size='small' variant='outlined'>
                  Lagre
                </Button>
              )}
            </>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MatchStats;
