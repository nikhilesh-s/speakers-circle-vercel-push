import { useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { isAdminUser } from '../lib/admin';
import { LoginPage } from './LoginPage';

export function AdminAccess({ children, onPageChange }: {
  children: ReactNode;
  onPageChange: (page: string) => void;
}) {
  const [status, setStatus] = useState<'loading' | 'allowed' | 'denied'>('loading');
  useEffect(() => {
    const client = supabase;
    if (!client) { setStatus('denied'); return; }
    let active = true;
    let generation = 0;
    const verify = async () => {
      const request = ++generation;
      setStatus('loading');
      // Validate with Auth, rather than trusting an editable local session object.
      try {
        const { data: { session } } = await client.auth.getSession();
        if (!session) {
          if (active && request === generation) setStatus('denied');
          return;
        }
        const { data, error } = await client.auth.getUser();
        if (active && request === generation) setStatus(!error && isAdminUser(data.user) ? 'allowed' : 'denied');
      } catch {
        if (active && request === generation) setStatus('denied');
      }
    };
    const { data: { subscription } } = client.auth.onAuthStateChange(() => {
      // Leave the auth callback before making another Auth request.
      window.setTimeout(() => { if (active) void verify(); }, 0);
    });
    void verify();
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  if (status === 'loading') return <div role="status" className="pt-24 text-center">Checking administrator access…</div>;
  if (status === 'denied') return <LoginPage onPageChange={onPageChange} />;
  return <>{children}</>;
}
