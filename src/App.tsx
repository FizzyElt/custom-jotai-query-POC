import { ScopeProvider } from 'jotai-scope';
import { listResultAtom } from './query';
import DemoPage from './DemoPage';
import { QueryClientProvider } from '@tanstack/react-query';
import ReactQueryDemoPage, { queryClient } from './ReactQueryDemoPage';

function App() {
  return (
    <>
      <div>
        <ScopeProvider atoms={[listResultAtom]}>
          <DemoPage />
        </ScopeProvider>

        <QueryClientProvider client={queryClient}>
          <ReactQueryDemoPage />
        </QueryClientProvider>
      </div>
    </>
  );
}

export default App;
