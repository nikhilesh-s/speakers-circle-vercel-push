import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useTestimonials, useEditableContent } from '../hooks/useSupabase';

const TestimonialsPage: React.FC = () => {
  const { testimonials, loading } = useTestimonials();
  const { content: registrationLink } = useEditableContent('registration_link');
  const { content: impactStats } = useEditableContent('impact_stats');

  // Default impact statistics
  const defaultStats = [
    { value: '95%', label: 'Increase in Confidence', color: 'text-[#FA7C92]' },
    { value: '200+', label: 'Students Mentored', color: 'text-[#6EC4DB]' },
    { value: '17+', label: 'Years of Experience', color: 'text-[#66AB8C]' },
    { value: '100%', label: 'Dedication to Growth', color: 'text-[#FFF7C0]' }
  ];

  // Parse impact stats from database or use defaults
  let parsedStats = defaultStats;
  if (impactStats) {
    try {
      parsedStats = JSON.parse(impactStats);
    } catch (error) {
      console.error('Error parsing impact stats:', error);
      parsedStats = defaultStats;
    }
  }
  const starArray = Array(5).fill(0);

  return (
    <div className="pt-16">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-[#FFF7C0]/30 via-white to-[#6EC4DB]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Success <span className="text-[#FA7C92]">Stories</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how our students have transformed their communication skills and built lasting confidence
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FA7C92]"></div>
              <p className="mt-4 text-gray-600">Loading testimonials...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  What Our Community Says
                </h2>
                <p className="text-lg text-gray-600">
                  Real stories from real students who found their voice
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => {
                  const colors = [
                    'from-[#FA7C92]/10 to-[#FA7C92]/5 border-[#FA7C92]/20',
                    'from-[#6EC4DB]/10 to-[#6EC4DB]/5 border-[#6EC4DB]/20',
                    'from-[#66AB8C]/10 to-[#66AB8C]/5 border-[#66AB8C]/20',
                    'from-[#FFF7C0]/40 to-[#FFF7C0]/20 border-[#FFF7C0]/60'
                  ];
                  const colorClass = colors[index % colors.length];

                  const avatarColors = [
                    'from-[#FA7C92] to-[#FA7C92]/80',
                    'from-[#6EC4DB] to-[#6EC4DB]/80',
                    'from-[#66AB8C] to-[#66AB8C]/80',
                    'from-[#FFF7C0] to-[#FFF7C0]/80'
                  ];
                  const avatarClass = avatarColors[index % avatarColors.length];

                  return (
                    <div
                      key={testimonial.id}
                      className={`bg-gradient-to-br ${colorClass} p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02]`}
                    >
                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 text-gray-300" size={32} />
                        <div className="relative z-10">
                          {/* Rating */}
                          <div className="flex items-center mb-4">
                            {starArray.map((_, i) => (
                              <Star
                                key={i}
                                className="text-yellow-400 fill-current"
                                size={20}
                              />
                            ))}
                          </div>

                          {/* Testimonial Content */}
                          <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                            "{testimonial.content}"
                          </p>

                          {/* Student Info */}
                          <div className="flex items-center">
                            <div className={`w-14 h-14 bg-gradient-to-br ${avatarClass} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                              {testimonial.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <h4 className="text-xl font-semibold text-gray-900">
                                {testimonial.name}
                              </h4>
                              <p className="text-[#66AB8C] font-medium">
                                {testimonial.program}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add more testimonials if we have them */}
              {testimonials.length > 4 && (
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.slice(4).map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex items-center mb-4">
                        {starArray.map((_, i) => (
                          <Star
                            key={i}
                            className="text-yellow-400 fill-current"
                            size={16}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                        "{testimonial.content.length > 150 
                          ? testimonial.content.substring(0, 150) + '...'
                          : testimonial.content}"
                      </p>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FA7C92] to-[#6EC4DB] rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <h5 className="font-semibold text-gray-900 text-sm">
                            {testimonial.name}
                          </h5>
                          <p className="text-[#66AB8C] text-xs font-medium">
                            {testimonial.category || testimonial.program}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-br from-[#66AB8C]/10 to-[#FFF7C0]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600">
              Transforming lives through communication excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {parsedStats.map((stat, index) => (
              <div key={index} className="text-center bg-white p-8 rounded-2xl shadow-lg">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Journey */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Student Journey
            </h2>
            <p className="text-xl text-gray-600">
              From nervous beginnings to confident leadership
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FA7C92] to-[#FA7C92]/70 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Starting Point
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Most students begin with nervousness about public speaking and uncertainty about their voice. 
                This is completely normal and where every great speaker started.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#6EC4DB] to-[#6EC4DB]/70 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Building Skills
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Through structured practice, supportive feedback, and gradual challenges, students develop 
                confidence and discover their unique communication style.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#66AB8C] to-[#66AB8C]/70 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Leadership
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Students emerge as confident communicators and leaders, ready to make positive impacts 
                in their schools, communities, and future careers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#FA7C92]/10 via-[#6EC4DB]/5 to-[#66AB8C]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of students who have discovered their voice and unlocked their potential
          </p>
          
          {registrationLink ? (
            <a
              href={registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-[#FA7C92] to-[#6EC4DB] text-white px-8 py-4 rounded-lg text-xl font-semibold hover:transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Start Your Journey Today
            </a>
          ) : (
            <a
              href="http://tinyurl.com/SpeakersCircleYLP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-[#FA7C92] to-[#6EC4DB] text-white px-8 py-4 rounded-lg text-xl font-semibold hover:transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Start Your Journey Today
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default TestimonialsPage;