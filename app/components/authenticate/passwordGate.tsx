'use client';

import {
  FC,
  FormEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';

const LOCAL_STORAGE_KEY = 'verydebate-auth';

export const PasswordGate: FC<PropsWithChildren> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthenticated(localStorage.getItem(LOCAL_STORAGE_KEY) === 'true');
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
          localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
          setAuthenticated(true);
        } else {
          setError('Wrong password');
        }
      } catch {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    },
    [password],
  );

  // Still checking localStorage
  if (authenticated === null) return null;

  if (authenticated) return <>{children}</>;

  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-50">
      <form
        onSubmit={handleSubmit}
        className="flex w-80 flex-col gap-4"
      >
        <h1 className="text-center text-lg font-medium text-neutral-700">
          VeryDebate
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          autoFocus
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-800 outline-none focus:border-neutral-500"
        />
        <button
          type="submit"
          disabled={loading || !password}
          className="rounded-lg bg-neutral-700 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-600 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Checking...' : 'Enter'}
        </button>
        {error && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}
      </form>
    </div>
  );
};
