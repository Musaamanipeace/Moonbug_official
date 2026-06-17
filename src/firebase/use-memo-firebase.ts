'use client';

import { useMemo, DependencyList } from 'react';

/**
 * A utility hook to stabilize Firebase references (Queries, DocumentReferences).
 * It ensures that a new reference is only created when the dependencies change,
 * preventing infinite render loops in hooks like useCollection or useDoc.
 */
export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
