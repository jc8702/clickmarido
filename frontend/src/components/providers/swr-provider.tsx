'use client';

import { SWRConfig } from 'swr';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        dedupingInterval: 5000,
        focusThrottleInterval: 5000,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      {children}
    </SWRConfig>
  );
}
