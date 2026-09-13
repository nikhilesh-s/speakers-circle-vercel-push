// Supabase configuration and client setup
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (supabasePublicKey && !supabasePublicKey.startsWith('sb_publishable_')) {
  throw new Error('A modern Supabase publishable key is required.');
}

export const supabase = supabaseUrl && supabasePublicKey
  ? createClient(supabaseUrl, supabasePublicKey)
  : null;

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabasePublicKey && supabase);
};

// Safe operation wrapper for Supabase calls
export const safeSupabaseOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using fallback data');
    return fallback;
  }
  
  try {
    return await operation();
  } catch {
    console.error('Database operation failed. Please try again.');

    return fallback;
  }
};

// Database types
export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  payment_link?: string;
  event_type?: string;
  created_at: string;
  is_recurring?: boolean;
  recurrence_type?: 'weekly' | 'monthly';
  recurrence_days?: string[];
  recurrence_end_date?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  program: string;
  category?: string;
  created_at: string;
}

export interface EditableContent {
  id: string;
  section: string;
  content: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  message: string;
  created_at: string;
}