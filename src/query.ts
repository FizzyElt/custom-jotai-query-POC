import { createQueryAtom,createInvalidatedAtom } from './jotai_query';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getList = (params: { count: number }) =>
  delay(2000).then(() =>
    Array.from({ length: params.count }, (_, i) => ({ id: i + 1, name: `name${i + 1}` }))
  );

export const [listResultAtom, useList] = createQueryAtom(getList, (p) => p.count);


export const invalidateListAtom = createInvalidatedAtom([listResultAtom])