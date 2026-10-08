import { useAuth } from '@clerk/expo';
import { useCallback, useSyncExternalStore } from 'react';
import { profilePhotos } from '@/data/demo-profile';
const records = new Map<string, string[]>();
const listeners = new Set<() => void>();
const previewSaved = profilePhotos.filter(item => item.saved).map(item => item.id);
const empty: string[] = [];
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function useSessionSaved() {
  const { userId } = useAuth();
  const scope = userId ? `user:${userId}` : 'preview';
  const initial = userId ? empty : previewSaved;
  const snapshot = useCallback(() => records.get(scope) ?? initial, [scope, initial]);
  const saved = useSyncExternalStore(subscribe, snapshot, snapshot);
  const setSaved = useCallback((update: (current: string[]) => string[]) => {
    records.set(scope, update(records.get(scope) ?? initial));
    listeners.forEach(listener => listener());
  }, [scope, initial]);
  return [saved, setSaved] as const;
}
