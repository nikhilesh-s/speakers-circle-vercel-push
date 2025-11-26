import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Edit2, Trash2, Save, X, Calendar, Users, MessageSquare, Link, Settings } from 'lucide-react';
import { supabase, safeSupabaseOperation, Event, Testimonial, EditableContent } from '../lib/supabase';
import { RichTextEditor } from './RichTextEditor';

interface AdminPageProps {
  onPageChange: (page: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onPageChange }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [isAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);

  // Events state
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    payment_link: '',
    event_type: 'Special Events',
    is_recurring: false,
    recurrence_type: '',
    recurrence_days: [] as string[],
    recurrence_end_date: ''
  });

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    content: '',
    category: 'Students'
  });

  // Content state
  const [editableContent, setEditableContent] = useState<Record<string, string>>({});
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [tempContent, setTempContent] = useState<string>('');

  // Links state
  const [siteLinks, setSiteLinks] = useState<Record<string, string>>({});
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [tempLink, setTempLink] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log('Fetching admin data...');
    
    if (!supabase) {
      console.warn('Supabase not configured, skipping data fetch');
      return;
    }

    // Fetch events
    console.log('Fetching events...');
    const eventsResult = await safeSupabaseOperation(
      async () => {
        const { data } = await supabase!.from('events').select('*').order('date', { ascending: true });
        console.log('Events fetched:', data);
        return data || [];
      },
      []
    );
    setEvents(eventsResult);

    // Fetch testimonials
    console.log('Fetching testimonials...');
    const testimonialsResult = await safeSupabaseOperation(
      async () => {
        const { data } = await supabase!.from('testimonials').select('*').order('created_at', { ascending: false });
        console.log('Testimonials fetched:', data);
        return data || [];
      },
      []
    );
    setTestimonials(testimonialsResult);

    // Fetch editable content
    console.log('Fetching editable content...');
    const contentResult = await safeSupabaseOperation(
      async () => {
        const { data } = await supabase!.from('editable_content').select('*');
        console.log('Content fetched:', data);
        return data || [];
      },
      []
    );
    
    const contentObj: Record<string, string> = {};
    const linksObj: Record<string, string> = {};
    contentResult.forEach((item: EditableContent) => {
      if (item.section.endsWith('_link')) {
        linksObj[item.section] = item.content;
      } else {
        contentObj[item.section] = item.content;
      }
    });
    console.log('Content organized:', { contentObj, linksObj });
    setEditableContent(contentObj);
    setSiteLinks(linksObj);
  };

  const handleLogout = () => {
    onPageChange('home');
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== EVENT SUBMISSION DEBUG ===');
    console.log('Raw form data:', newEvent);
    console.log('Supabase client exists:', !!supabase);
    console.log('User authenticated:', isAuthenticated);
    
    if (!supabase) {
      console.error('Supabase not configured');
      alert('Database not configured. Please check your environment variables.');
      return;
    }
    
    if (editingEvent) {
      console.log('=== UPDATING EXISTING EVENT ===');
      console.log('Event ID:', editingEvent.id);
      console.log('Update data:', newEvent);
      
      // Update existing event
      const result = await safeSupabaseOperation(
        async () => {
          console.log('Executing update query...');
          const { error } = await supabase!
            .from('events')
            .update(newEvent)
            .eq('id', editingEvent.id);
          if (error) {
            console.error('UPDATE ERROR DETAILS:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
            throw error;
          }
          console.log('UPDATE SUCCESS');
          return true;
        },
        false
      );
      
      if (result) {
        setEditingEvent(null);
        setNewEvent({ 
          title: '', 
          date: '', 
          time: '', 
          description: '', 
          payment_link: '',
          is_recurring: false,
          recurrence_type: '',
          recurrence_days: [],
          recurrence_end_date: ''
        });
        fetchData();
        alert('Event updated successfully!');
      } else {
        alert('Failed to update event. Please check your database connection.');
      }
    } else {
      // Create new event
      console.log('=== CREATING NEW EVENT ===');
      
      // Clean up the data before sending
      const eventData = {
        title: newEvent.title.trim(),
        date: newEvent.date,
        time: newEvent.time.trim(),
        description: newEvent.description.trim(),
        payment_link: newEvent.payment_link?.trim() || '',
        is_recurring: newEvent.is_recurring || false,
        recurrence_type: newEvent.is_recurring ? newEvent.recurrence_type : null,
        recurrence_days: newEvent.is_recurring ? newEvent.recurrence_days : [],
        recurrence_end_date: newEvent.is_recurring && newEvent.recurrence_end_date ? newEvent.recurrence_end_date : null
      };
      
      console.log('Cleaned event data:', eventData);
      console.log('Data types check:', {
        title: typeof eventData.title,
        date: typeof eventData.date,
        time: typeof eventData.time,
        description: typeof eventData.description,
        payment_link: typeof eventData.payment_link,
        is_recurring: typeof eventData.is_recurring,
        recurrence_type: typeof eventData.recurrence_type,
        recurrence_days: Array.isArray(eventData.recurrence_days),
        recurrence_end_date: typeof eventData.recurrence_end_date
      });
      
      const result = await safeSupabaseOperation(
        async () => {
          console.log('Executing insert query...');
          const { error } = await supabase!
            .from('events')
            .insert(eventData);
          if (error) {
            console.error('INSERT ERROR DETAILS:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code,
              eventData: eventData
            });
            throw error;
          }
          console.log('INSERT SUCCESS');
          return true;
        },
        false
      );
      
      if (result) {
        setNewEvent({ 
          title: '', 
          date: '', 
          time: '', 
          description: '', 
          payment_link: '',
          is_recurring: false,
          recurrence_type: '',
          recurrence_days: [],
          recurrence_end_date: ''
        });
        fetchData();
        alert('Event created successfully!');
      } else {
        console.error('Event creation failed - check console for details');
        alert('Failed to create event. Check console for detailed error information.');
      }
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Attempting to submit testimonial:', newTestimonial);
    
    if (!supabase) {
      console.error('Supabase not configured');
      alert('Database not configured. Please check your environment variables.');
      return;
    }
    
    if (editingTestimonial) {
      // Update existing testimonial
      const result = await safeSupabaseOperation(
        async () => {
          console.log('Updating testimonial:', editingTestimonial.id);
          const { error } = await supabase!
            .from('testimonials')
            .update({
              name: newTestimonial.name,
              content: newTestimonial.content,
              category: newTestimonial.category
            })
            .eq('id', editingTestimonial.id);
          if (error) {
            console.error('Testimonial update error:', error);
            throw error;
          }
          console.log('Testimonial updated successfully');
          return true;
        },
        false
      );
      
      if (result) {
        setEditingTestimonial(null);
        setNewTestimonial({ name: '', content: '', category: 'Students' });
        fetchData();
        alert('Testimonial updated successfully!');
      } else {
        alert('Failed to update testimonial. Please check your database connection.');
      }
    } else {
      // Create new testimonial
      console.log('Creating new testimonial...');
      const result = await safeSupabaseOperation(
        async () => {
          console.log('Inserting new testimonial...');
          const { error } = await supabase!
            .from('testimonials')
            .insert({
              name: newTestimonial.name,
              content: newTestimonial.content,
              category: newTestimonial.category
            });
          if (error) {
            console.error('Testimonial insert error:', error);
            throw error;
          }
          console.log('Testimonial inserted successfully');
          return true;
        },
        false
      );
      
      if (result) {
        setNewTestimonial({ name: '', content: '', category: 'Students' });
        fetchData();
        alert('Testimonial created successfully!');
      } else {
        alert('Failed to create testimonial. Please check your database connection.');
      }
    }
  };

  const handleContentUpdate = async (section: string, content: string) => {
    console.log('Attempting to update content:', section, content);
    
    if (!supabase) {
      console.error('Supabase not configured');
      alert('Database not configured. Please check your environment variables.');
      return;
    }

    const result = await safeSupabaseOperation(
      async () => {
        console.log('Executing upsert operation...');
        const { error } = await supabase!
          .from('editable_content')
          .upsert({ section, content, updated_at: new Date().toISOString() }, { onConflict: 'section' });
        if (error) {
          console.error('Supabase upsert error:', error);
          throw error;
        }
        console.log('Upsert successful');
        return true;
      },
      false
    );
    
    console.log('Operation result:', result);
    
    if (result) {
      setEditableContent({ ...editableContent, [section]: content });
      setEditingContent(null);
      setTempContent('');
      alert('Content updated successfully!');
    } else {
      alert('Failed to update content. Please check your database connection.');
    }
  };

  const handleLinkUpdate = async (section: string, link: string) => {
    console.log('Attempting to update link:', section, link);
    
    if (!supabase) {
      console.error('Supabase not configured');
      alert('Database not configured. Please check your environment variables.');
      return;
    }

    const result = await safeSupabaseOperation(
      async () => {
        console.log('Executing link upsert operation...');
        const { error } = await supabase!
          .from('editable_content')
          .upsert({ section, content: link, updated_at: new Date().toISOString() }, { onConflict: 'section' });
        if (error) {
          console.error('Supabase link upsert error:', error);
          throw error;
        }
        console.log('Link upsert successful');
        return true;
      },
      false
    );
    
    console.log('Link operation result:', result);
    
    if (result) {
      setSiteLinks({ ...siteLinks, [section]: link });
      setEditingLink(null);
      setTempLink('');
      alert('Link updated successfully!');
    } else {
      alert('Failed to update link. Please check your database connection.');
    }
  };

  const deleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const result = await safeSupabaseOperation(
        async () => {
          const { error } = await supabase!.from('events').delete().eq('id', id);
          if (error) throw error;
          return true;
        },
        false
      );
      
      if (result) fetchData();
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const result = await safeSupabaseOperation(
        async () => {
          const { error } = await supabase!.from('testimonials').delete().eq('id', id);
          if (error) throw error;
          return true;
        },
        false
      );
      
      if (result) fetchData();
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FA7C92]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    onPageChange('login');
    return null;
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 text-sm"
          >
            <LogOut className="mr-2" size={16} />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-[#FA7C92] text-[#FA7C92]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="inline mr-2" size={16} />
                Content & Links
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-[#FA7C92] text-[#FA7C92]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="inline mr-2" size={16} />
                Events
              </button>
              <button
                onClick={() => setActiveTab('testimonials')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'testimonials'
                    ? 'border-[#FA7C92] text-[#FA7C92]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="inline mr-2" size={16} />
                Testimonials
              </button>
            </nav>
          </div>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                {editingEvent && (
                  <button
                    onClick={() => {
                      setEditingEvent(null);
                      setNewEvent({ 
                        title: '', 
                        date: '', 
                        time: '', 
                        description: '', 
                        payment_link: '',
                        event_type: 'Special Events',
                        is_recurring: false,
                        recurrence_type: '',
                        recurrence_days: [],
                        recurrence_end_date: ''
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="text"
                      required
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                      placeholder="e.g., 4:00 PM - 5:30 PM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                    <select
                      required
                      value={newEvent.event_type}
                      onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                    >
                      <option value="YLC">YLC (Youth Leadership Circle)</option>
                      <option value="Gavel Club">Gavel Club Meeting</option>
                      <option value="CICC">CICC Elementary</option>
                      <option value="Special Events">Special Events</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Link (optional)</label>
                    <input
                      type="url"
                      value={newEvent.payment_link}
                      onChange={(e) => setNewEvent({ ...newEvent, payment_link: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                      placeholder="https://stripe.com/..."
                    />
                  </div>
                  <div></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                  />
                </div>
                
                {/* Recurring Event Options */}
                <div className="border-t pt-4">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="is_recurring"
                      checked={newEvent.is_recurring}
                      onChange={(e) => setNewEvent({ ...newEvent, is_recurring: e.target.checked })}
                      className="h-4 w-4 text-[#FA7C92] focus:ring-[#FA7C92] border-gray-300 rounded"
                    />
                    <label htmlFor="is_recurring" className="ml-2 block text-sm font-medium text-gray-700">
                      Make this a recurring event
                    </label>
                  </div>
                  
                  {newEvent.is_recurring && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence Pattern</label>
                        <select
                          value={newEvent.recurrence_type}
                          onChange={(e) => setNewEvent({ ...newEvent, recurrence_type: e.target.value as 'weekly' | 'monthly' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                          required
                        >
                          <option value="">Select pattern</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      
                      {newEvent.recurrence_type === 'weekly' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Days of the week</label>
                          <div className="grid grid-cols-7 gap-2">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                              <label key={day} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={newEvent.recurrence_days.includes(index.toString())}
                                  onChange={(e) => {
                                    const dayStr = index.toString();
                                    if (e.target.checked) {
                                      setNewEvent({
                                        ...newEvent,
                                        recurrence_days: [...newEvent.recurrence_days, dayStr]
                                      });
                                    } else {
                                      setNewEvent({
                                        ...newEvent,
                                        recurrence_days: newEvent.recurrence_days.filter(d => d !== dayStr)
                                      });
                                    }
                                  }}
                                  className="h-3 w-3 text-[#FA7C92] focus:ring-[#FA7C92] border-gray-300 rounded"
                                />
                                <span className="ml-1 text-xs text-gray-600">{day.slice(0, 3)}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
                        <input
                          type="date"
                          value={newEvent.recurrence_end_date}
                          onChange={(e) => setNewEvent({ ...newEvent, recurrence_end_date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty for ongoing recurring events</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="bg-[#FA7C92] text-white px-4 py-2 rounded-md hover:bg-[#FA7C92]/90 transition-colors duration-200"
                >
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
              </form>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Events</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {events.map((event) => (
                  <div key={event.id} className="px-6 py-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(event.date).toLocaleDateString()} • {event.time}
                      </p>
                      <p className="text-gray-700">{event.description}</p>
                      {event.payment_link && (
                        <p className="text-sm text-[#66AB8C] mt-1">Payment link included</p>
                      )}
                      {event.is_recurring && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Recurring {event.recurrence_type}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-2">
                            {event.event_type || 'Special Events'}
                          </span>
                        </div>
                      )}
                      {!event.is_recurring && event.event_type && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {event.event_type}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setNewEvent({
                            title: event.title,
                            date: event.date,
                            time: event.time,
                            description: event.description,
                            payment_link: event.payment_link || '',
                            is_recurring: event.is_recurring || false,
                            recurrence_type: event.recurrence_type || '',
                            recurrence_days: event.recurrence_days || [],
                            recurrence_end_date: event.recurrence_end_date || ''
                          });
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                {editingTestimonial && (
                  <button
                    onClick={() => {
                      setEditingTestimonial(null);
                      setNewTestimonial({ name: '', content: '', program: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              
              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                    <input
                      type="text"
                      required
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      required
                      value={newTestimonial.category}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                    >
                      <option value="Students">Students</option>
                      <option value="Parents">Parents</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Professional Speakers">Professional Speakers</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Content</label>
                  <textarea
                    rows={4}
                    required
                    value={newTestimonial.content}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                    placeholder="Share the student's success story..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#FA7C92] text-white px-4 py-2 rounded-md hover:bg-[#FA7C92]/90 transition-colors duration-200"
                >
                  {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
                </button>
              </form>
            </div>

            {/* Testimonials List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Testimonials</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="px-6 py-4 flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{testimonial.name}</h4>
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-[#66AB8C]/10 text-[#66AB8C] rounded-full">
                          {testimonial.category || testimonial.program}
                        </span>
                      </div>
                      <p className="text-gray-700 italic">"{testimonial.content}"</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingTestimonial(testimonial);
                          setNewTestimonial({
                            name: testimonial.name,
                            content: testimonial.content,
                            program: testimonial.program
                          });
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteTestimonial(testimonial.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Site Links Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <Link className="text-[#66AB8C] mr-3" size={24} />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Site Links Management</h2>
                  <p className="text-sm text-gray-600">Manage important links used throughout the website</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'registration_link', label: 'YLC Registration Form', description: 'Link to the Youth Leadership Circle registration form' },
                  { key: 'program_flyer_link', label: 'Program Flyer', description: 'Link to the program information flyer' },
                  { key: 'program_description_link', label: 'Program Description', description: 'Link to detailed program description document' },
                  { key: 'newsletter_link', label: 'Current Newsletter', description: 'Link to the current month\'s newsletter' },
                  { key: 'instagram_link', label: 'Instagram Profile', description: 'Link to Instagram social media profile' },
                  { key: 'facebook_link', label: 'Facebook Profile', description: 'Link to Facebook social media profile' },
                  { key: 'youtube_link', label: 'YouTube Channel', description: 'Link to YouTube channel (optional)' }
                ].map((linkItem) => (
                  <div key={linkItem.key} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{linkItem.label}</h3>
                        <p className="text-sm text-gray-600">{linkItem.description}</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingLink(linkItem.key);
                          setTempLink(siteLinks[linkItem.key] || '');
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>
                    
                    {editingLink === linkItem.key ? (
                      <div className="space-y-3">
                        <input
                          type="url"
                          value={tempLink}
                          onChange={(e) => setTempLink(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                          placeholder="https://example.com/link"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleLinkUpdate(linkItem.key, tempLink)}
                            className="bg-[#66AB8C] text-white px-4 py-2 rounded-md hover:bg-[#66AB8C]/90 transition-colors duration-200 flex items-center text-sm"
                          >
                            <Save size={16} className="mr-2" />
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingLink(null);
                              setTempLink('');
                            }}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        {siteLinks[linkItem.key] ? (
                          <a 
                            href={siteLinks[linkItem.key]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 break-all"
                          >
                            {siteLinks[linkItem.key]}
                          </a>
                        ) : (
                          <span className="text-gray-500 italic">No link set</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content Management */}
            {[
              { key: 'mission', label: 'Mission Statement', description: 'Organization mission on About page' },
              { key: 'vision', label: 'Vision Statement', description: 'Organization vision on About page' },
              { key: 'about_founder', label: 'About Founder', description: 'Founder biography on About page (supports rich text formatting)' },
              { key: 'newsletter', label: 'Newsletter Content', description: 'Current newsletter content for homepage (supports rich text formatting)' },
              { key: 'impact_stats', label: 'Impact Statistics', description: 'Statistics displayed on testimonials page (JSON format)' }
            ].map((section) => (
              <div key={section.key} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{section.label}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingContent(section.key);
                      setTempContent(editableContent[section.key] || '');
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                
                {editingContent === section.key ? (
                  <div className="space-y-4">
                    {(section.key === 'newsletter' || section.key === 'about_founder') ? (
                      <RichTextEditor
                        value={tempContent}
                        onChange={setTempContent}
                        placeholder={section.key === 'newsletter' ? "Create your newsletter content with rich formatting..." : "Write the founder's biography with rich formatting..."}
                        height="300px"
                      />
                    ) : section.key === 'impact_stats' ? (
                      <div className="space-y-4">
                        <textarea
                          rows={8}
                          value={tempContent}
                          onChange={(e) => setTempContent(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92] font-mono text-sm"
                          placeholder={`Enter statistics in JSON format:
[
  {"value": "95%", "label": "Increase in Confidence", "color": "text-[#FA7C92]"},
  {"value": "200+", "label": "Students Mentored", "color": "text-[#6EC4DB]"},
  {"value": "17+", "label": "Years of Experience", "color": "text-[#66AB8C]"},
  {"value": "100%", "label": "Dedication to Growth", "color": "text-[#FFF7C0]"}
]`}
                        />
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">Format Instructions:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Use valid JSON format with an array of objects</li>
                            <li>• Each object needs: "value", "label", and "color" properties</li>
                            <li>• Available colors: text-[#FA7C92], text-[#6EC4DB], text-[#66AB8C], text-[#FFF7C0]</li>
                            <li>• You can have up to 4 statistics for best display</li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <textarea
                        rows={6}
                        value={tempContent}
                        onChange={(e) => setTempContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#FA7C92] focus:border-[#FA7C92]"
                        placeholder={`Enter your ${section.label.toLowerCase()}...`}
                      />
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleContentUpdate(section.key, tempContent)}
                        className="bg-[#66AB8C] text-white px-4 py-2 rounded-md hover:bg-[#66AB8C]/90 transition-colors duration-200 flex items-center"
                      >
                        <Save size={16} className="mr-2" />
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingContent(null);
                          setTempContent('');
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    {(section.key === 'newsletter' || section.key === 'about_founder') ? (
                      <div 
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ 
                          __html: editableContent[section.key] || '<p class="text-gray-500 italic">No content set yet. Click edit to add content.</p>' 
                        }} 
                      />
                    ) : section.key === 'impact_stats' ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                          {editableContent[section.key] || `[
  {"value": "95%", "label": "Increase in Confidence", "color": "text-[#FA7C92]"},
  {"value": "200+", "label": "Students Mentored", "color": "text-[#6EC4DB]"},
  {"value": "17+", "label": "Years of Experience", "color": "text-[#66AB8C]"},
  {"value": "100%", "label": "Dedication to Growth", "color": "text-[#FFF7C0]"}
]`}
                        </pre>
                      </div>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {editableContent[section.key] || 'No content set yet. Click edit to add content.'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
