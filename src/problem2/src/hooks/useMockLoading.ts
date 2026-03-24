import { useRef, useEffect, useCallback, useSyncExternalStore } from "react";

export function useMockLoading(debouncedSearch: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingRef = useRef(false);
  const listenersRef = useRef(new Set<() => void>());

  const subscribe = useCallback((cb: () => void) => {
    listenersRef.current.add(cb);
    return () => { listenersRef.current.delete(cb); };
  }, []);

  const getSnapshot = useCallback(() => loadingRef.current, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (debouncedSearch === "") {
      loadingRef.current = false;
      listenersRef.current.forEach((cb) => cb());
      return;
    }

    loadingRef.current = true;
    listenersRef.current.forEach((cb) => cb());

    const delay = 300 + Math.random() * 300;
    timerRef.current = setTimeout(() => {
      loadingRef.current = false;
      listenersRef.current.forEach((cb) => cb());
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [debouncedSearch]);

  const loading = useSyncExternalStore(subscribe, getSnapshot);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    loadingRef.current = false;
    listenersRef.current.forEach((cb) => cb());
  }, []);

  return { loading, reset };
}
