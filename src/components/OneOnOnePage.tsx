import React from 'react';
import { ExternalLink, MessageCircle, Mail } from 'lucide-react';

const OneOnOnePage: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-br from-[#FFF7C0]/30 via-white to-[#6EC4DB]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            1-on-1 <span className="text-[#FA7C92]">Sessions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Personalized coaching and specialized instruction tailored to your unique needs and goals
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#FA7C92]/5 to-[#6EC4DB]/5 p-8 rounded-2xl border border-gray-100 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Personalized Learning Experience
                </h2>
                <p className="text-lg text-gray-600">
                  Get individualized attention and customized instruction to accelerate your growth
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Communication Coaching</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Public speaking improvement</li>
                    <li>• Interview preparation</li>
                    <li>• Presentation skills</li>
                    <li>• Confidence building</li>
                    <li>• Speech writing and delivery</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Skills</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Programming and coding</li>
                    <li>• Robotics and engineering</li>
                    <li>• Technology education</li>
                    <li>• Project mentorship</li>
                    <li>• Academic support</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Ready to Get Started?
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Fill out our consultation form to begin your personalized learning journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-20 bg-gradient-to-br from-[#66AB8C]/10 to-[#FFF7C0]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  How It Works
                </h2>
                <p className="text-lg text-gray-600">
                  Simple steps to schedule your personalized session
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#FA7C92] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Submit Form
                  </h3>
                  <p className="text-gray-600">
                    Complete our 1-on-1 consultation form with your goals and preferences
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-[#6EC4DB] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Get Contacted
                  </h3>
                  <p className="text-gray-600">
                    Ms. Shalini will reach out via email or message to schedule your session
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-[#66AB8C] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Start Learning
                  </h3>
                  <p className="text-gray-600">
                    Begin your personalized journey with expert guidance and support
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#FA7C92]/10 to-[#66AB8C]/10 p-6 rounded-xl border-l-4 border-[#FA7C92]">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Important Instructions
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start">
                    <span className="font-medium mr-2">1.</span>
                    <span>Fill out the 1-on-1 Google Form completely and accurately</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium mr-2">2.</span>
                    <span>Once submitted, email or message Ms. Shalini directly to confirm your interest</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium mr-2">3.</span>
                    <span>Be specific about your goals, availability, and any particular areas of focus</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium mr-2">4.</span>
                    <span>Allow 24-48 hours for initial response and scheduling confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready for Personalized Growth?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Take the next step in your learning journey with expert 1-on-1 guidance
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://forms.gle/nZFP27LfatMvjcWF8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-[#FA7C92] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#FA7C92]/90 transition-colors duration-200 shadow-lg"
            >
              <ExternalLink className="mr-3" size={20} />
              Fill Out 1-on-1 Form
            </a>
            <a
              href="mailto:gallantgaveliers@gmail.com"
              onClick={(e) => {
                e.preventDefault();
                // Just show a message instead of opening mail client
                alert('Please email Ms. Shalini at: gallantgaveliers@gmail.com');
              }}
              className="inline-flex items-center bg-white border-2 border-[#66AB8C] text-[#66AB8C] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#66AB8C] hover:text-white transition-colors duration-200 shadow-lg cursor-pointer"
            >
              <Mail className="mr-3" size={20} />
              Email Ms. Shalini
            </a>
          </div>

          <div className="mt-8 p-4 bg-[#FFF7C0]/30 rounded-lg">
            <p className="text-sm text-gray-600">
              <MessageCircle className="inline mr-2" size={16} />
              Remember: After submitting the form, please email or message Ms. Shalini to confirm your submission and discuss next steps.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OneOnOnePage;