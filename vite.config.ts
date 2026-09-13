import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  if (command === 'build') {
    if (!env.VITE_SUPABASE_PUBLISHABLE_KEY?.startsWith('sb_publishable_')) {
      throw new Error('Build requires VITE_SUPABASE_PUBLISHABLE_KEY in modern publishable format.');
    }
    if (!env.VITE_SUPABASE_URL || new URL(env.VITE_SUPABASE_URL).protocol !== 'https:') {
      throw new Error('Build requires an HTTPS VITE_SUPABASE_URL.');
    }
  }
  return { plugins: [react()], optimizeDeps: { exclude: ['lucide-react'] } };
});
