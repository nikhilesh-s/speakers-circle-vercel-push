import type { User } from '@supabase/supabase-js';

// UI access only. Database RLS is the authorization boundary.
export const isAdminUser = (user: Pick<User, 'id' | 'app_metadata'> | null | undefined): boolean =>
  Boolean(user?.id && user.app_metadata?.role === 'admin');

