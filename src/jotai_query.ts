import { atom, useAtom, WritableAtom, useSetAtom } from 'jotai';
import { PrimitiveAtom } from 'jotai/vanilla';
import { useCallback, useRef, useEffect, useState } from 'react';

type QueryResult<T, E = unknown> =
  | {
      status: 'idle';
      isIdle: true;
      isLoading: false;
      isSuccess: false;
      isError: false;
      data?: T;
      error?: E;
      isInvalidated: boolean;
    }
  | {
      status: 'loading';
      isIdle: false;
      isLoading: true;
      isSuccess: false;
      isError: false;
      data?: T;
      error?: E;
      isInvalidated: boolean;
    }
  | {
      status: 'success';
      isIdle: false;
      isLoading: false;
      isSuccess: true;
      isError: false;
      data: T;
      error?: E;
      isInvalidated: boolean;
    }
  | {
      status: 'error';
      isIdle: false;
      isLoading: false;
      isSuccess: false;
      isError: true;
      data?: T;
      error: E;
      isInvalidated: boolean;
    };

export function createQueryAtom<T, E = unknown, P = unknown>(
  fn: (p: P) => Promise<T>,
  getParamsKey: (p: P) => string | number | null = () => null
) {
  const queryResultAtom = atom<QueryResult<T, E>>({
    status: 'idle',
    isIdle: true,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isInvalidated: false,
  });

  const useApi = (
    options: {
      params: P;
      enable?: boolean;
    },
    getKey: (p: P) => string | number | null = getParamsKey
  ) => {
    const { params, enable = false } = options;
    const [queryResult, setQueryResult] = useAtom(queryResultAtom);

    const isFirstFetching = useRef(true);

    const paramsRef = useRef(params);
    paramsRef.current = params;

    const paramsKey = getKey(params);

    const refetch = useCallback(
      () =>
        Promise.resolve(
          setQueryResult({
            status: 'loading',
            isIdle: false,
            isLoading: true,
            isSuccess: false,
            isError: false,
            isInvalidated: false,
          })
        )
          .then(() => fn(paramsRef.current))
          .then((res) =>
            setQueryResult({
              status: 'success',
              isIdle: false,
              isLoading: false,
              isSuccess: true,
              isError: false,
              data: res,
              isInvalidated: false,
            })
          )
          .catch((err: E) =>
            setQueryResult({
              status: 'error',
              isIdle: false,
              isLoading: false,
              isSuccess: false,
              isError: true,
              error: err,
              isInvalidated: false,
            })
          ),
      [setQueryResult]
    );

    useEffect(() => {
      if (
        isFirstFetching.current &&
        ((enable && queryResult.status === 'idle') ||
          (queryResult.status === 'idle' && queryResult.error !== undefined))
      ) {
        console.log('enable fetching');
        refetch().finally(() => (isFirstFetching.current = false));
      }
    }, [enable, queryResult.status, queryResult.error, refetch]);

    useEffect(() => {
      if (!isFirstFetching.current && queryResult.status !== 'loading') {
        console.log('key change fetching');
        refetch();
      }
    }, [paramsKey, refetch]);

    useEffect(() => {
      if (queryResult.isInvalidated && queryResult.status !== 'loading') {
        console.log('invalidate fetching');
        refetch();
      }
      if (queryResult.isInvalidated) {
        setQueryResult((prev) => ({ ...prev, isInvalidated: false }));
      }
    }, [queryResult.isInvalidated, queryResult.status, refetch, setQueryResult]);

    useEffect(
      () =>
        setQueryResult((prev) =>
          prev.status === 'error' ? { ...prev, status: 'idle', isIdle: true, isError: false } : prev
        ),
      [setQueryResult]
    );

    return refetch;
  };

  return [queryResultAtom, useApi] as const;
}

type MutationResult<T, E = unknown> =
  | {
      status: 'idle';
      isLoading: false;
      isIdle: true;
      isSuccess: false;
      isError: false;
      data?: T;
      error?: E;
    }
  | {
      status: 'loading';
      isLoading: true;
      isIdle: false;
      isSuccess: false;
      isError: false;
      data?: T;
      error?: E;
    }
  | {
      status: 'success';
      isLoading: false;
      isIdle: false;
      isSuccess: true;
      isError: false;
      data: T;
      error?: E;
    }
  | {
      status: 'error';
      isLoading: false;
      isIdle: false;
      isSuccess: false;
      isError: true;
      data?: T;
      error: E;
    };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createInvalidatedAtom = (atoms: PrimitiveAtom<QueryResult<any, any>>[]) =>
  atom(null, (_, set) =>
    atoms.forEach((atom) => set(atom, (prev) => ({ ...prev, isInvalidated: true })))
  );

export function useMutation<T, E, P>(
  fn: (p: P) => Promise<T>,
  setQueryAtoms: WritableAtom<null, [], void>
) {
  const [mutationState, setMutationState] = useState<MutationResult<T, E>>({
    status: 'idle',
    isLoading: false,
    isIdle: true,
    isSuccess: false,
    isError: false,
  });

  const invalidateQuery = useSetAtom(setQueryAtoms);

  const mutate = useCallback(
    (p: P) => {
      fn(p)
        .then((data) => {
          setMutationState({
            status: 'success',
            isLoading: false,
            isIdle: false,
            isSuccess: true,
            isError: false,
            data,
          });
          invalidateQuery();
        })
        .catch((err: E) => {
          setMutationState({
            status: 'error',
            isLoading: false,
            isIdle: false,
            isSuccess: false,
            isError: true,
            error: err,
          });
        });
    },
    [invalidateQuery, fn]
  );

  return {
    ...mutationState,
    mutate,
  };
}
