import { useCallback, useSyncExternalStore } from 'react';
export type LocalMessage = { id: string; text?: string; photo?: number; time: string };
const conversations = new Map<string, LocalMessage[]>();
const empty: LocalMessage[] = [];
const listeners = new Set<() => void>();
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export function useLocalChat(key: string) {
  const snapshot = useCallback(() => conversations.get(key) ?? empty, [key]);
  const messages = useSyncExternalStore(subscribe, snapshot, snapshot);
  const send = useCallback((message: Omit<LocalMessage, 'id' | 'time'>) => {
    conversations.set(key, [...(conversations.get(key) ?? []), { ...message, id: `${Date.now()}-${Math.random()}`, time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) }]);
    listeners.forEach(listener => listener());
  }, [key]);
  return [messages, send] as const;
}
