import React, { PropsWithChildren, useEffect } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SessionProvider, useSession } from 'next-auth/react';

export const queryClient = new QueryClient()
export const Provider = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />

      </QueryClientProvider>
    </SessionProvider>
  )
}

