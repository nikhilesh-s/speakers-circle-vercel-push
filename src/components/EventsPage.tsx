import React, { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, MapPin, Plus } from 'lucide-react';
import { useEvents, useEditableContent } from '../hooks/useSupabase';

const EventsPage: React.FC = () => {
  const { events, loading } = useEvents();
  const { content: registrationLink } = useEditableContent('registration_link');
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // Filter out recurring events and only show one-time events
  const oneTimeEvents = events.filter(event => !event.is_recurring);
  
  // Generate recurring Gavel Club meetings for current month
  // No longer generating hardcoded Gavel Club meetings - all events come from admin panel

  // Generate recurring events from database for current month
  const generateRecurringEvents = (baseEvents: any[], year: number, month: number) => {
    const generatedEvents = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (const event of baseEvents) {
      if (!event.is_recurring) continue;
      
      const eventDate = new Date(event.date);
      const currentMonthStart = new Date(year, month, 1);
      const currentMonthEnd = new Date(year, month + 1, 0);
      
      // Check if we should generate events for this month
      if (event.recurrence_end_date) {
        const endDate = new Date(event.recurrence_end_date);
        if (currentMonthStart > endDate) continue;
      }
      
      if (event.recurrence_type === 'weekly' && event.recurrence_days) {
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day);
          const dayOfWeek = date.getDay();
          
          if (event.recurrence_days.includes(dayOfWeek.toString())) {
            // Only generate if this date is after the original event date
            if (date >= eventDate) {
              generatedEvents.push({
                ...event,
                id: `${event.id}-recurring-${year}-${month}-${day}`,
                date: date.toISOString().split('T')[0],
                isRecurring: true
              });
            }
          }
        }
      } else if (event.recurrence_type === 'monthly') {
        const originalDay = eventDate.getDate();
        if (originalDay <= daysInMonth) {
          const recurringDate = new Date(year, month, originalDay);
          if (recurringDate >= eventDate) {
            generatedEvents.push({
              ...event,
              id: `${event.id}-recurring-${year}-${month}`,
              date: recurringDate.toISOString().split('T')[0],
              isRecurring: true
            });
          }
        }
      }
    }
    
    return generatedEvents;
  };
  
  const recurringEvents = generateRecurringEvents(events, currentYear, currentMonth);
  const allEvents = [...oneTimeEvents, ...recurringEvents];

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: string) => {
    return allEvents.filter(event => event.date === date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeColor = (event: any) => {
    if (event.event_type === 'YLC' || event.title.toLowerCase().includes('ylc') || event.title.toLowerCase().includes('youth leadership')) {
      return 'bg-[#FA7C92] text-white';
    }
    if (event.event_type === 'Gavel Club' || event.title.toLowerCase().includes('gavel')) {
      return 'bg-[#6EC4DB] text-white';
    }
    if (event.event_type === 'CICC' || event.title.toLowerCase().includes('cicc') || event.title.toLowerCase().includes('elementary')) {
      return 'bg-[#66AB8C] text-white';
    }
    return 'bg-[#FFF7C0] text-gray-800';
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

  return (
    <div className="pt-16">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-[#FFF7C0]/30 via-white to-[#6EC4DB]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Event <span className="text-[#FA7C92]">Calendar</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for transformative sessions, workshops, and weekly meetings designed to develop your communication and leadership skills
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FA7C92]"></div>
              <p className="mt-4 text-gray-600">Loading calendar...</p>
            </div>
          ) : (
            <>
              {/* Calendar Header */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#FA7C92] to-[#6EC4DB] p-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    
                    <h2 className="text-3xl font-bold text-white">
                      {monthNames[currentMonth]} {currentYear}
                    </h2>
                    
                    <button
                      onClick={() => navigateMonth('next')}
                      className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-6">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {dayNames.map(day => (
                      <div key={day} className="text-center font-semibold text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDay }, (_, i) => (
                      <div key={`empty-${i}`} className="h-32 bg-gray-50 rounded-lg"></div>
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const dayEvents = getEventsForDate(dateString);
                      const isToday = isCurrentMonth && today.getDate() === day;

                      return (
                        <div
                          key={day}
                          className={`h-32 p-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                            isToday 
                              ? 'border-[#FA7C92] bg-[#FA7C92]/5' 
                              : 'border-gray-200 bg-white hover:border-[#6EC4DB]/50'
                          }`}
                        >
                          <div className={`text-sm font-semibold mb-2 ${
                            isToday ? 'text-[#FA7C92]' : 'text-gray-700'
                          }`}>
                            {day}
                          </div>
                          
                          <div className="space-y-1">
                            {dayEvents.slice(0, 3).map((event, idx) => (
                              <div
                                key={`${event.id}-${idx}`}
                                className={`text-xs px-2 py-1 rounded-full truncate ${getEventTypeColor(event)}`}
                                title={`${event.title} - ${event.time}`}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-gray-500 px-2">
                                +{dayEvents.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#FA7C92] rounded-full mr-3"></div>
                    <span className="text-gray-700">YLC Events</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#6EC4DB] rounded-full mr-3"></div>
                    <span className="text-gray-700">Gavel Club</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#66AB8C] rounded-full mr-3"></div>
                    <span className="text-gray-700">CICC Elementary</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#FFF7C0] rounded-full mr-3"></div>
                    <span className="text-gray-700">Special Events</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Events List */}
              <div className="mt-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Upcoming Events
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {allEvents
                    .filter(event => new Date(event.date) >= new Date(today.toISOString().split('T')[0]))
                    .slice(0, 6)
                    .map((event, index) => (
                      <div
                        key={`${event.id}-${index}`}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">
                              {event.title}
                            </h4>
                            <div className="space-y-1">
                              <div className="flex items-center text-gray-600">
                                <Calendar className="mr-2 text-[#FA7C92]" size={16} />
                                <span className="text-sm font-medium">{formatDate(event.date)}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="mr-2 text-[#6EC4DB]" size={16} />
                                <span className="text-sm">{event.time}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <MapPin className="mr-2" size={16} />
                                <span className="text-sm">Dublin, CA / Zoom</span>
                              </div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event)}`}>
                            {event.isRecurring ? 'Weekly' : 'Event'}
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#66AB8C]/10 to-[#FFF7C0]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Join Our Next Event?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Take the first step towards developing your communication superpowers
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {registrationLink ? (
              <a
                href={registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FA7C92] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#FA7C92]/90 transition-colors duration-200 shadow-lg"
              >
                Register for YLC
              </a>
            ) : (
              <a
                href="http://tinyurl.com/SpeakersCircleYLP"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FA7C92] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#FA7C92]/90 transition-colors duration-200 shadow-lg"
              >
                Register for YLC
              </a>
            )}
            <button className="bg-white border-2 border-[#66AB8C] text-[#66AB8C] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#66AB8C] hover:text-white transition-colors duration-200 shadow-lg">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;