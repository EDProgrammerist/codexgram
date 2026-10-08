import { useCallback, useSyncExternalStore } from 'react';
export type ProfileDetails = { name: string; username: string; bio: string; location: string; website?: string; photo?: string };
const profiles = new Map<string, ProfileDetails>();
const listeners = new Set<() => void>();
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function useSessionProfile(key: string, initial: ProfileDetails) {
  const snapshot = useCallback(() => profiles.get(key), [key]);
  const saved = useSyncExternalStore(subscribe, snapshot, snapshot);
  const save = useCallback((profile: ProfileDetails) => { profiles.set(key, profile); listeners.forEach(listener => listener()); }, [key]);
  return [saved ?? initial, save] as const;
}
