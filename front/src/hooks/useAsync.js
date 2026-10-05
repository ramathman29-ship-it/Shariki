import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Runs an async loader on mount (and when `deps` change).
 * @returns {{ data: any, setData: Function, loading: boolean, error: Error|null, reload: Function }}
 */
export default function useAsync(loader, deps = [], initial = null) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const run = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);
    loaderRef
      .current()
      .then((result) => active && setData(result))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(run, deps);

  return { data, setData, loading, error, reload: run };
}
