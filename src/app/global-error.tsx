'use client';

import { Button, Typography } from '@mui/material';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang='en'>
      <body>
        <div>
          <Typography gutterBottom variant='h2'>
            Noe gikk galt
          </Typography>
          <Typography gutterBottom>{error.message}</Typography>
          <Button onClick={reset}>Prøv igjen</Button>
        </div>
      </body>
    </html>
  );
}
