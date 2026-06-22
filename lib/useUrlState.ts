"use client";

import { useEffect, useRef } from "react";

/**
 * Shareable-state URL sync for calculator islands.
 *
 * Calculators encode their inputs in the URL query string so a result can be
 * bookmarked or shared. But the URL should stay clean on a fresh page load and
 * only start reflecting state *after the visitor changes something* — so the
 * address bar reads `/category/slug`, not `/category/slug?…`, until they
 * interact.
 *
 * This hook:
 *  1. hydrates state from the URL once on mount (via `read` + `apply`), and
 *  2. records the loaded query as a baseline, then writes back to the URL only
 *     once the serialized state diverges from that baseline.
 *
 * The divergence check is by value (not a render counter), so it behaves
 * correctly under React Strict Mode's double-invoked effects in development.
 *
 * @param state      Current input state.
 * @param read       Builds the full state to hydrate from `window.location`
 *                   (returns the equivalent of the defaults when no params).
 * @param serialize  Turns state into a query string *without* the leading "?".
 * @param apply      Commits the hydrated state (typically the `setState` setter).
 */
export function useUrlState<T>(
  state: T,
  read: () => T,
  serialize: (state: T) => string,
  apply: (state: T) => void,
) {
  const baseline = useRef<string | null>(null);
  const synced = useRef(false);
  // Capture the callbacks once so they aren't effect dependencies (which would
  // re-run the effects every render). They're effectively pure — `read`/
  // `serialize` derive only from the URL and the `state` argument, and `apply`
  // wraps stable state setters — so the mount-time copy stays correct.
  const fns = useRef({ read, serialize, apply });

  // Hydrate from the URL once, and record what was loaded as the baseline.
  useEffect(() => {
    const loaded = fns.current.read();
    fns.current.apply(loaded);
    baseline.current = fns.current.serialize(loaded);
  }, []);

  // Mirror state into the URL, but only after it differs from the loaded state.
  useEffect(() => {
    if (baseline.current === null) return;
    const query = fns.current.serialize(state);
    if (!synced.current) {
      // Wait until state has caught up to the loaded baseline before we ever
      // write — this swallows the initial hydration render(s).
      if (query === baseline.current) synced.current = true;
      return;
    }
    if (query === baseline.current) return;
    const { pathname } = window.location;
    window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
  }, [state]);
}
