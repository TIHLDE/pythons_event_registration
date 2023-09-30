'use client';

import { Button } from '@nextui-org/button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang='en'>
      <body>
        <div>
          <h2 className='mb-4'>Noe gikk galt</h2>
          <p className='mb-2'>{error.message}</p>
          <Button onClick={reset}>Prøv igjen</Button>
        </div>
      </body>
    </html>
  );
}
