'use client';

import { NextUIProvider } from '@nextui-org/react';
import { DehydratedState, HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function Providers({ children, dehydratedState }: { children: ReactNode; dehydratedState: DehydratedState }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
