import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Match } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

export type MatchStatsProps = {
  match: Match;
};

const validateResultInput = (value: string) => {
  const regex = /^\d+-\d+$/;
  return regex.test(value);
};

const MatchStats = ({ match }: MatchStatsProps) => {
  const [resultValue, setResultValue] = useState('');
  const [editResult, setEditResult] = useState(match.result === null);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResultValue(event.target.value);
  };

  const addResult = async () => {
    if (validateResultInput(resultValue)) {
      await axios.put(`/api/match/${match.id}`, {
        data: { result: resultValue },
      });
      setEditResult(false);
      router.replace(router.asPath);
    }
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
              <TextField helperText='Format: tall-tall' label='Resultat' onChange={handleChange} size='small' value={resultValue} />
              <Button disabled={!validateResultInput(resultValue)} onClick={addResult} size='small' variant='outlined'>
                Lagre
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MatchStats;
