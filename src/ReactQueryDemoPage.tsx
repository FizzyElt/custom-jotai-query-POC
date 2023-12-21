import { useState } from 'react';
import { getList } from './query';

import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

const ReactQueryDemoPage = () => {
    const [enable, setEnable] = useState(false)

    const [count, setCount] = useState(1);
    const listResult = useQuery({
        queryKey: ['a', count],
        queryFn: () => {
            console.log('fetch')
            return getList({ count })
        },
        enabled: enable,
        gcTime: 0
    })

    const { mutate } = useMutation({
        mutationFn: () => Promise.resolve(1),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['a'] })
    })
    return (
        <div>
            <h1>react query v5</h1>
            <div>
                <button onClick={() => setEnable(!enable)}>
                    toggle
                </button>
                <button onClick={() => setCount(count + 1)}>increase count</button>
                <button onClick={() => setCount(1)}>reset count</button>
                <button onClick={() => listResult.refetch()}>refetch</button>
                <button onClick={() => mutate(undefined)}>mutate invalidate</button>
                <p>params count: {count}</p>
                <p>enable: {enable.toString()}</p>
            </div>

            <h3>
                {listResult.status}
                {listResult.isError}
            </h3>
            {(listResult.data || []).map(({ id, name }) => (
                <div key={id}>{name}</div>
            ))}
        </div>
    );
};

export default ReactQueryDemoPage;