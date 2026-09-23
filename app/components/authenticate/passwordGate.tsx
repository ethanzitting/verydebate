'use client';

import {
  FC,
  FormEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';

export const PasswordGate: FC<PropsWithChildren> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/auth', { cache: 'no-store', signal: controller.signal })
      .then((response) => response.json())
      .then((result) => setAuthenticated(result.authenticated === true))
      .catch(() => {
        if (!controller.signal.aborted) setAuthenticated(false);
      });
    return () => controller.abort();
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });

        if (res.ok) {
          setAuthenticated(true);
        } else {
          const result = await res.json();
          setError(result.error ?? 'Sign in failed.');
        }
      } catch {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    },
    [password],
  );

  // Check the server session before showing the app.
  if (authenticated === null) return null;

  if (authenticated) return <>{children}</>;

  return (
    <main className="auth-page">
      <div className="auth-brand">verydebate<span>.</span></div>
      <section className="auth-panel" aria-labelledby="auth-title">
        <h1 id="auth-title">Open the live transcript</h1>
        <p>Enter the shared password to start a debate session.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="debate-password">Password</label>
          <input
            id="debate-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={loading || !password}>
            {loading ? 'Checking...' : 'Open transcript'}
          </button>
          {error && <p className="auth-error" role="alert">{error}</p>}
        </form>
      </section>
    </main>
  );
};
