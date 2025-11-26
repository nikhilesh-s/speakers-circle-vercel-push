import React from 'react';
import { CheckCircle, Clock, Users, DollarSign, ArrowRight } from 'lucide-react';
import { useEditableContent } from '../hooks/useSupabase';

interface InformationPageProps {
  onPageChange: (page: string) => void;
}

export const InformationPage: React.FC<InformationPageProps> = ({ onPageChange }) => {
  const { content: registrationLink } = useEditableContent('registration_link');

  return (
    <div className="pt-16">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-[#FFF7C0]/30 via-white to-[#6EC4DB]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Program <span className="text-[#FA7C92]">Information</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive pathway to developing exceptional communication and leadership skills
          </p>
        </div>
      </section>

      {/* Program Pathway */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Speakers Circle Program Pathway
            </h2>
            <p className="text-xl text-gray-600">
              A structured journey from beginner to confident leader
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Step 1: YLC */}
            <div className="bg-gradient-to-br from-[#FA7C92]/10 to-[#FA7C92]/5 p-8 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#FA7C92] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 ml-4">
                  Youth Leadership Circle (YLC)
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="text-[#FA7C92] mr-3" size={20} />
                  <span className="text-gray-700">6–8 weeks duration</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-[#FA7C92] mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Attend meetings alongside current Gavel Club members</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-[#FA7C92] mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Deliver two prepared speeches</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-[#FA7C92] mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Take on meeting roles and perform peer evaluations</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-[#FA7C92] mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Gain firsthand experience of the Toastmasters format</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-[#FA7C92] mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Receive personalized feedback and assessment</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg border border-[#FA7C92]/20">
                <p className="text-sm text-gray-600">
                  <strong>Assessment:</strong> Students are evaluated by the coordinator to recognize strengths, 
                  understand goals, and identify areas for improvement.
                </p>
              </div>
            </div>

            {/* Step 2: Gavel Club */}
            <div className="bg-gradient-to-br from-[#6EC4DB]/10 to-[#6EC4DB]/5 p-8 rounded-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#6EC4DB] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 ml-4">
                  Gavel Club Membership
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="text-[#6EC4DB] mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Available after completing YLC</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-[#6EC4DB] mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Weekly public speaking and leadership practice</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-[#6EC4DB] mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Advanced communication skills development</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-[#6EC4DB] mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Leadership roles and responsibilities</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="text-[#6EC4DB] mr-3 mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">Ongoing mentorship and peer support</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg border border-[#6EC4DB]/20">
                <p className="text-sm text-gray-600">
                  <strong>Invitation Only:</strong> Students receive a formal invitation with membership 
                  details after successfully completing the YLC program.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Developed */}
      <section className="py-20 bg-gradient-to-br from-[#66AB8C]/10 to-[#FFF7C0]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Skills Beyond the Stage
            </h2>
            <p className="text-xl text-gray-600">
              While public speaking is at the core, our program goes further by equipping students with:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Development</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Professional guest speakers</li>
                <li>• Interview skills training</li>
                <li>• Phone etiquette mastery</li>
                <li>• Professional email writing</li>
                <li>• Effective networking</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Communication Excellence</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Presentation skills</li>
                <li>• Storytelling techniques</li>
                <li>• Speech organization & structure</li>
                <li>• Audience-focused delivery</li>
                <li>• Interpersonal communication</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Life Skills</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Confidence building</li>
                <li>• Punctuality</li>
                <li>• Responsibility</li>
                <li>• Teamwork</li>
                <li>• Time & project management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Membership & Fees */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Membership & <span className="text-[#66AB8C]">Investment</span>
            </h2>
            <p className="text-xl text-gray-600">
              Transparent pricing for transformative education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* YLC Pricing */}
            <div className="bg-gradient-to-br from-[#FA7C92]/10 to-[#FA7C92]/5 p-8 rounded-2xl border border-[#FA7C92]/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Youth Leadership Circle
                </h3>
                <p className="text-gray-600">6-8 week introductory program</p>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-[#FA7C92] mb-2">$150</div>
                <p className="text-gray-600">Flat fee for complete program</p>
              </div>
              
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-[#FA7C92] mr-3 flex-shrink-0" size={20} />
                  <span>Up to 6 weeks of training</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-[#FA7C92] mr-3 flex-shrink-0" size={20} />
                  <span>2 prepared speeches</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-[#FA7C92] mr-3 flex-shrink-0" size={20} />
                  <span>Meeting roles & evaluations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-[#FA7C92] mr-3 flex-shrink-0" size={20} />
                  <span>Personalized assessment</span>
                </li>
              </ul>
              
              {registrationLink ? (
                <a
                  href={registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#FA7C92] text-white py-3 rounded-lg font-semibold hover:bg-[#FA7C92]/90 transition-colors duration-200 flex items-center justify-center"
                >
                  Register for YLC
                  <ArrowRight className="ml-2" size={20} />
                </a>
              ) : (
                <a
                  href="http://tinyurl.com/SpeakersCircleYLP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#FA7C92] text-white py-3 rounded-lg font-semibold hover:bg-[#FA7C92]/90 transition-colors duration-200 flex items-center justify-center"
                >
                  Register for YLC
                  <ArrowRight className="ml-2" size={20} />
                </a>
              )}
            </div>

            {/* Gavel Club Pricing */}
            <div className="bg-gradient-to-br from-[#6EC4DB]/10 to-[#6EC4DB]/5 p-8 rounded-2xl border border-[#6EC4DB]/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Gavel Club Membership
                </h3>
                <p className="text-gray-600">After YLC completion</p>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-[#6EC4DB] mb-2">$75</div>
                <p className="text-gray-600">Monthly membership fee</p>
                <div className="text-2xl font-semibold text-gray-700 mt-4">+ $150</div>
                <p className="text-gray-600">One-time registration fee</p>
              </div>
              
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="text-[#6EC4DB] mr-3 flex-shrink-0" size={20} />
                  <span>Weekly meetings year-round</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-[#6EC4DB] mr-3 flex-shrink-0" size={20} />
                  <span>Advanced skill development</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-[#6EC4DB] mr-3 flex-shrink-0" size={20} />
                  <span>Leadership opportunities</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="text-[#6EC4DB] mr-3 flex-shrink-0" size={20} />
                  <span>Ongoing mentorship</span>
                </li>
              </ul>
              
              <div className="bg-white p-4 rounded-lg border border-[#6EC4DB]/20">
                <p className="text-sm text-gray-600 text-center">
                  <strong>Note:</strong> Fees are due monthly, including during breaks.
                  Meetings pause during long weekends and holidays.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Classes */}
      <section className="py-20 bg-gradient-to-br from-[#66AB8C]/10 to-[#FFF7C0]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Additional Programs
            </h2>
            <p className="text-xl text-gray-600">
              Specialized programs for different age groups and needs
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  CICC – Elementary Interpersonal Communication Camp
                </h3>
                <p className="text-lg text-gray-600">Designed specifically for elementary students</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Users className="text-[#66AB8C] mr-3" size={24} />
                      <span className="text-lg font-medium text-gray-700">Elementary Students</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="text-[#66AB8C] mr-3" size={24} />
                      <span className="text-lg font-medium text-gray-700">Mondays 3:45–4:45 PM</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center md:text-right">
                <p className="text-gray-600 italic">
                  Based in Dublin, California<br />
                  Hybrid model – participants can join via Zoom<br />
                  Emphasis on small group building
                </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 1-on-1 Coaching Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              1-on-1 <span className="text-[#FA7C92]">Coaching</span>
            </h2>
            <p className="text-xl text-gray-600">
              Personalized coaching tailored to your specific needs and goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Technical Coaching */}
            <div className="bg-gradient-to-br from-[#66AB8C]/10 to-[#66AB8C]/5 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Coaching</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Programming and coding</li>
                <li>• Robotics and engineering</li>
                <li>• Technology education</li>
                <li>• Project mentorship</li>
                <li>• Academic support</li>
              </ul>
            </div>

            {/* Communication Coaching */}
            <div className="bg-gradient-to-br from-[#FA7C92]/10 to-[#FA7C92]/5 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Communication Coaching</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Gavel Club preparation</li>
                <li>• YLC skill development</li>
                <li>• Public speaking improvement</li>
                <li>• Presentation skills</li>
                <li>• Interview preparation</li>
              </ul>
            </div>

            {/* Leadership Coaching */}
            <div className="bg-gradient-to-br from-[#6EC4DB]/10 to-[#6EC4DB]/5 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Leadership Coaching</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• Networking skills</li>
                <li>• Leadership development</li>
                <li>• Team management</li>
                <li>• Professional growth</li>
                <li>• Confidence building</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onPageChange('1on1')}
              className="bg-gradient-to-r from-[#FA7C92] to-[#6EC4DB] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Learn More About 1-on-1 Coaching
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let your voice lead the way with Speakers Circle
          </p>
          
          {registrationLink ? (
            <a
              href={registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-[#FA7C92] to-[#6EC4DB] text-white px-8 py-4 rounded-lg text-xl font-semibold hover:transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Register Now
              <ArrowRight className="ml-3" size={24} />
            </a>
          ) : (
            <a
              href="http://tinyurl.com/SpeakersCircleYLP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-[#FA7C92] to-[#6EC4DB] text-white px-8 py-4 rounded-lg text-xl font-semibold hover:transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Register Now
              <ArrowRight className="ml-3" size={24} />
            </a>
          )}
        </div>
      </section>
    </div>
  );
};