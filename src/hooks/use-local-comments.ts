import { useCallback, useSyncExternalStore } from 'react';
import { seedComments, type DemoComment } from '@/data/demo-comments';
const records = new Map<string, DemoComment[]>();
const listeners = new Set<() => void>();
const empty: DemoComment[] = [];
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function useLocalComments(postId: string, seeded = true) {
  const snapshot = useCallback(() => records.get(postId) ?? (seeded ? seedComments : empty), [postId, seeded]);
  const comments = useSyncExternalStore(subscribe, snapshot, snapshot);
  const update = useCallback((next: DemoComment[]) => { records.set(postId, next);listeners.forEach(listener => listener()); }, [postId]);
  return [comments, update] as const;
}
