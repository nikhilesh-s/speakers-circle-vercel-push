import React from 'react';
import { ArrowRight, BookOpen, Users, Award } from 'lucide-react';
import { useTestimonials, useEditableContent } from '../hooks/useSupabase';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const { testimonials, loading: testimonialsLoading } = useTestimonials();
  const { content: newsletterContent, loading: newsletterLoading } = useEditableContent('newsletter');
  const { content: registrationLink } = useEditableContent('registration_link');
  const { content: newsletterLink } = useEditableContent('newsletter_link');

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FFF7C0] via-white to-[#6EC4DB]/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Voice is your{' '}
              <span className="text-[#FA7C92]">Superpower</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              A Leadership & Communication Program by Speakers Circle
            </p>
            <p className="text-lg text-gray-600 mb-12">
              Affiliated with Toastmasters International
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {registrationLink ? (
                <a
                  href={registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#FA7C92] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#FA7C92]/90 transition-colors duration-200 shadow-lg"
                >
                  Register for YLC
                  <ArrowRight className="ml-2" size={20} />
                </a>
              ) : (
                <a
                  href="http://tinyurl.com/SpeakersCircleYLP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#FA7C92] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#FA7C92]/90 transition-colors duration-200 shadow-lg"
                >
                  Register for YLC
                  <ArrowRight className="ml-2" size={20} />
                </a>
              )}
              <button
                onClick={() => onPageChange('information')}
                className="inline-flex items-center bg-white text-[#66AB8C] border-2 border-[#66AB8C] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#66AB8C] hover:text-white transition-colors duration-200 shadow-lg"
              >
                Explore our Programs
                <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#FA7C92]/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#6EC4DB]/20 rounded-full blur-xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Empower Your Future
            </h2>
            <p className="text-xl text-gray-600">
              Develop essential skills for personal and professional success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#FA7C92]/10 to-[#FA7C92]/5">
              <div className="w-16 h-16 bg-[#FA7C92] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Leadership Development
              </h3>
              <p className="text-gray-600">
                Build confidence and develop essential leadership skills through practical experience and mentorship.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#6EC4DB]/10 to-[#6EC4DB]/5">
              <div className="w-16 h-16 bg-[#6EC4DB] rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Communication Excellence
              </h3>
              <p className="text-gray-600">
                Master public speaking, presentations, and interpersonal communication skills for all situations.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-[#66AB8C]/10 to-[#66AB8C]/5">
              <div className="w-16 h-16 bg-[#66AB8C] rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-white" size={24} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Personal Growth
              </h3>
              <p className="text-gray-600">
                Develop confidence, responsibility, teamwork, and time management skills that last a lifetime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#FFF7C0]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Stay Connected
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get the latest updates, tips, and success stories from our community
          </p>
          
          {!newsletterLoading && newsletterContent && (
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <div dangerouslySetInnerHTML={{ __html: newsletterContent }} />
            </div>
          )}
          
          {newsletterLink ? (
            <a
              href={newsletterLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#66AB8C] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#66AB8C]/90 transition-colors duration-200 shadow-lg"
            >
              Check out this month's newsletter!
            </a>
          ) : (
            <button className="bg-[#66AB8C] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#66AB8C]/90 transition-colors duration-200 shadow-lg">
              Check out this month's newsletter!
            </button>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from our amazing students and their transformative journeys
            </p>
          </div>

          {!testimonialsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FA7C92] to-[#6EC4DB] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-[#66AB8C] font-medium">
                        {testimonial.program}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};