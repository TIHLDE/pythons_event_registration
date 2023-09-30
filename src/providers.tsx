'use client';

import { NextUIProvider } from '@nextui-org/react';
import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function Providers({ children, dehydratedState }: { children: ReactNode; dehydratedState: DehydratedState }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>{children}</Hydrate>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
