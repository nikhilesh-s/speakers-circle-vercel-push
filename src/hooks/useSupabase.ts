import { useState, useEffect } from 'react';
import { supabase, safeSupabaseOperation, Event, Testimonial, EditableContent } from '../lib/supabase';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    const result = await safeSupabaseOperation(
      async () => {
        const { data } = await supabase!
          .from('events')
          .select('*')
          .order('date', { ascending: true });
        return data || [];
      },
      []
    );
    setEvents(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, refetch: fetchEvents };
};

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    const result = await safeSupabaseOperation(
      async () => {
        const { data } = await supabase!
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });
        return data || [];
      },
      [
        {
          id: '1',
          name: 'Sarah Martinez',
          content: 'The Youth Leadership Circle transformed my confidence completely. I went from being terrified of speaking in front of others to presenting confidently at school events.',
          program: 'YLC Graduate',
          category: 'Students',
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          name: 'Alex Chen',
          content: 'Joining the Gavel Club was the best decision I made in high school. The leadership skills I learned helped me become student body president.',
          program: 'Gavel Club Member',
          category: 'Alumni',
          created_at: new Date().toISOString()
        }
      ]
    );
    setTestimonials(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return { testimonials, loading, refetch: fetchTestimonials };
};

export const useEditableContent = (section: string) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    const result = await safeSupabaseOperation(
      async () => {
        const { data } = await supabase!
          .from('editable_content')
          .select('content')
          .eq('section', section)
          .maybeSingle();
        return data?.content || '';
      },
      ''
    );
    setContent(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, [section]);

  return { content, loading, refetch: fetchContent };
};