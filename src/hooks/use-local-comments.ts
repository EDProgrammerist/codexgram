import { useCallback, useSyncExternalStore } from 'react';
import { seedComments, type DemoComment } from '@/data/demo-comments';
const records = new Map<string, Record<string, DemoComment[]>>();
const listeners = new Set<() => void>();
const emptyRecords: Record<string, DemoComment[]> = {};
const empty: DemoComment[] = [];
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function isSeededPost(postId: string) { return postId === 'sarah-como' || postId === 'alex-amalfi'; }
function useCommentRecords(userId: string | null | undefined) {
  // Signed-out development previews never share records with authenticated users.
  const scope = userId ? `user:${userId}` : 'preview';
  const snapshot = useCallback(() => records.get(scope) ?? emptyRecords, [scope]);
  return [useSyncExternalStore(subscribe, snapshot, snapshot), scope] as const;
}
export function useLocalComments(userId: string | null | undefined, postId: string, seeded = true) {
  const [posts, scope] = useCommentRecords(userId);
  const comments = posts[postId] ?? (seeded ? seedComments : empty);
  const update = useCallback((next: DemoComment[]) => {
    records.set(scope, { ...records.get(scope), [postId]: next });
    listeners.forEach(listener => listener());
  }, [scope, postId]);
  return [comments, update] as const;
}
export function useLocalCommentDelta(userId: string | null | undefined) {
  const [posts] = useCommentRecords(userId);
  return (postId: string) => posts[postId] ? posts[postId].length - (isSeededPost(postId) ? seedComments.length : 0) : 0;
}
