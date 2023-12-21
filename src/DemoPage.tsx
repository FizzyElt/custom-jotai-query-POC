import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { useList, listResultAtom, invalidateListAtom } from './query';
import { useMutation } from './jotai_query';

const DemoPage = () => {
  const [enable, setEnable] = useState(false)
  const [count, setCount] = useState(1);
  const listResult = useAtomValue(listResultAtom);
  const refetch = useList({ params: { count }, enable: enable });
  const { mutate } = useMutation(() => Promise.resolve(1), invalidateListAtom);

  return (
    <div>
      <h1>custom jotai query</h1>
      <div>
        <button onClick={() => setEnable(!enable)}>
          toggle
        </button>
        <button onClick={() => setCount(count + 1)}>increase count</button>
        <button onClick={() => setCount(1)}>reset count</button>
        <button onClick={() => refetch()}>refetch</button>
        <button onClick={() => mutate(undefined)}>mutate invalidate</button>
        <p>params count: {count}</p>
        <p>enable: {enable.toString()}</p>
      </div>
      <h3>
        {listResult.status}
      </h3>
      {(listResult.data || []).map(({ id, name }) => (
        <div key={id}>{name}</div>
      ))}
    </div>
  );
};

export default DemoPage;
