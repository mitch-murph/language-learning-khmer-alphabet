/**
 * AsyncStorage-backed state — the RN analogue of the prototype's useLocalStorage.
 * Loads asynchronously; avoids clobbering stored values with the initial before hydration.
 */
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function usePersistedState<T>(
  key: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [val, setVal] = useState<T>(initial);
  const hydrated = useRef(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key)
      .then((s) => {
        if (active && s != null) {
          try {
            setVal(JSON.parse(s) as T);
          } catch {
            // ignore malformed value
          }
        }
        hydrated.current = true;
      })
      .catch(() => {
        hydrated.current = true;
      });
    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(key, JSON.stringify(val)).catch(() => {});
  }, [key, val]);

  return [val, setVal];
}
