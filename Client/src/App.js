import React from 'react';
import AppRouter from './Navigation';
import { BrowserRouter } from 'react-router-dom';
import { MetaMaskProvider } from "metamask-react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MetaMaskProvider>
          <AppRouter />
        </MetaMaskProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
