import { useState } from 'react';
import { ScopeProvider } from 'jotai-scope';
import { listResultAtom } from './query';
import DemoPage from './DemoPage';
function App() {
  const [enable, setEnable] = useState(true);
  return (
    <>
      <button onClick={() => setEnable(!enable)}>toggle</button>
      {enable && (
        <ScopeProvider atoms={[listResultAtom]}>
          <DemoPage />
        </ScopeProvider>
      )}
    </>
  );
}

export default App;
