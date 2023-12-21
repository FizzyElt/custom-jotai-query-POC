# Custom simple jotai query

- `createQueryAtom`
- `createInvalidatedAtom`
- `useMutation`

create

```typescript
export const [resultAtom, useApi] = createQueryAtom(fetchApi);
```

```jsx
const Component = () => {
  const result = useAtomValue(resultAtom)

  // auto fetch in mount
  const refetch = useApi({params: xxx, enable: true})

  const { mutate } = useMutation(xxxMutation, invalidatedAtom)

  // ...
}
```