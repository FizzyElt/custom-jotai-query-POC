import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { useList, listResultAtom, invalidateListAtom } from './query';
import { useMutation } from './jotai_query';

const DemoPage = () => {
  const listResult = useAtomValue(listResultAtom);
  const [count, setCount] = useState(1);
  const refetch = useList({ params: { count }, enable: true });
  const { mutate } = useMutation(() => Promise.resolve(1), invalidateListAtom);

  return (
    <div>
      <div>
        <button onClick={() => setCount(count + 1)}>increase count</button>
        <button onClick={() => setCount(1)}>reset count</button>
        <button onClick={() => refetch()}>refetch</button>
        <button onClick={() => mutate(undefined)}>mutate invalidate</button>
        <p>params count: {count}</p>
      </div>

      {listResult.isLoading && <div>loading...</div>}
      {listResult.isError && <div>error</div>}
      {listResult.isIdle && <div>idle</div>}
      {(listResult.data || []).map(({ id, name }) => (
        <div key={id}>{name}</div>
      ))}
    </div>
  );
};

export default DemoPage;
