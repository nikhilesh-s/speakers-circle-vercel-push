// Supabase configuration and client setup
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
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
    console.log('Executing Supabase operation...');
    return await operation();
  } catch (error) {
    console.error('=== SUPABASE OPERATION FAILED ===');
    console.error('Error object:', error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // If it's an authentication error, still return fallback
    if (error instanceof Error && error.message.includes('JWT')) {
      console.warn('Authentication error, using fallback');
    }
    
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