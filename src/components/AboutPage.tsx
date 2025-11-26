import React from 'react';
import { useEditableContent } from '../hooks/useSupabase';

export const AboutPage: React.FC = () => {
  const { content: aboutContent, loading: aboutLoading } = useEditableContent('about_founder');
  const { content: missionContent, loading: missionLoading } = useEditableContent('mission');
  const { content: visionContent, loading: visionLoading } = useEditableContent('vision');

  const defaultMission = "To foster strong communication, leadership, and life skills, that will help individuals unlock their full potential, by building meaningful connections, and creating lasting impact in their personal and professional lives.";
  
  const defaultVision = "SpeakersCircle is dedicated to equipping youth with essential communication and leadership skills, helping them build strong personal and professional networks. We develop vital life skills, including confidence, teamwork, and time management preparing them for success in all aspects of life. SpeakersCircle is a community where you gain invaluable guidance from mentors. We believe that your voice is your superpower.";

  return (
    <div className="pt-16">
      {/* Meet Our Founder Section */}
      <section className="py-20 bg-gradient-to-br from-[#FFF7C0]/30 via-white to-[#6EC4DB]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Meet Our <span className="text-[#FA7C92]">Founder</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Shalini Suravarjjala
                </h2>
                
                {!aboutLoading && aboutContent ? (
                  <div 
                    className="space-y-6 text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: aboutContent }}
                  />
                ) : (
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <p>
                      Shalini Suravarjjala is a software engineer, technology educator, and the founder of SpeakersCircle. 
                      With over 21 years in the software industry and 17+ years in education, she has mentored hundreds of 
                      students in robotics, drone technology, and programming while also guiding youth in communication, 
                      leadership, and confidence-building.
                    </p>
                    
                    <p>
                      As the director of several successful youth initiatives—including Dublin High School's award-winning 
                      robotics program—she has helped students transform technical curiosity into real-world innovation, 
                      while also inspiring them to express themselves with clarity and purpose.
                    </p>
                    
                    <p>
                      Passionate about empowering the next generation, Shalini combines her love for engineering and education 
                      with her dedication to mentorship. At SpeakersCircle, she teaches students not only how to communicate 
                      effectively—in speeches, conversations, interviews, and digital platforms—but also how to lead with 
                      confidence, embrace their unique voices, and pay it forward by mentoring others.
                    </p>
                  </div>
                )}

                <div className="mt-8 p-6 bg-gradient-to-r from-[#FA7C92]/10 to-[#66AB8C]/10 rounded-xl border-l-4 border-[#FA7C92]">
                  <p className="text-lg font-medium text-gray-800 mb-4">
                    "I help the future leaders of tomorrow to develop strong communication, leadership and life skills."
                  </p>
                  <p className="text-lg font-medium text-gray-800 italic">
                    "Empowering youth with the confidence to speak, the clarity to lead, and the courage to inspire—because 
                    your voice is your superpower"
                  </p>
                  <p className="text-right text-[#66AB8C] font-semibold mt-2">
                    – Shalini Suravarjjala
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FA7C92]/20 to-[#6EC4DB]/20 rounded-2xl transform rotate-3"></div>
                <img
                  src="https://i.imgur.com/pQZ4zdf.jpeg"
                  alt="Shalini Suravarjjala"
                  className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FA7C92] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">M</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <div className="bg-gradient-to-br from-[#FA7C92]/5 to-[#FA7C92]/10 p-8 rounded-2xl">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {!missionLoading && missionContent ? missionContent : defaultMission}
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6EC4DB] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">V</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <div className="bg-gradient-to-br from-[#6EC4DB]/5 to-[#6EC4DB]/10 p-8 rounded-2xl">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {!visionLoading && visionContent ? visionContent : defaultVision}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Class Information Section */}
      <section className="py-20 bg-gradient-to-br from-[#66AB8C]/10 to-[#FFF7C0]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Class Information
            </h2>
            <p className="text-xl text-gray-600">
              Ready to transform your communication skills?
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Speakers Circle - Gallant Gaveliers Gavel Club
              </h3>
              <p className="text-lg text-[#66AB8C] font-semibold mb-2">
                Your Voice is your Superpower
              </p>
              <p className="text-gray-600">
                A Leadership & Communication Program by Speakers Circle<br />
                Affiliated with Toastmasters International<br />
                <span className="font-medium">Based in Dublin, California</span><br />
                Hybrid model – participants can join via Zoom<br />
                Emphasis on small group building
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RegistrationButton />

              <ProgramFlyerButton />

              <ProgramDetailsButton />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper components for dynamic links
const RegistrationButton = () => {
  const { content: registrationLink } = useEditableContent('registration_link');
  
  if (registrationLink) {
    return (
      <a
        href={registrationLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-br from-[#FA7C92] to-[#FA7C92]/80 text-white p-6 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        <h4 className="text-lg font-semibold mb-2">Registration Form</h4>
        <p className="text-sm opacity-90">Start your journey today</p>
      </a>
    );
  }
  
  return (
    <a
      href="http://tinyurl.com/SpeakersCircleYLP"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gradient-to-br from-[#FA7C92] to-[#FA7C92]/80 text-white p-6 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-200 shadow-lg"
    >
      <h4 className="text-lg font-semibold mb-2">Registration Form</h4>
      <p className="text-sm opacity-90">Start your journey today</p>
    </a>
  );
};

const ProgramFlyerButton = () => {
  const { content: flyerLink } = useEditableContent('program_flyer_link');
  
  if (flyerLink) {
    return (
      <a
        href={flyerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-br from-[#6EC4DB] to-[#6EC4DB]/80 text-white p-6 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        <h4 className="text-lg font-semibold mb-2">Program Flyer</h4>
        <p className="text-sm opacity-90">Learn more about our offerings</p>
      </a>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-[#6EC4DB] to-[#6EC4DB]/80 text-white p-6 rounded-xl text-center">
      <h4 className="text-lg font-semibold mb-2">Program Flyer</h4>
      <p className="text-sm opacity-90">Learn more about our offerings</p>
    </div>
  );
};

const ProgramDetailsButton = () => {
  const { content: detailsLink } = useEditableContent('program_description_link');
  
  if (detailsLink) {
    return (
      <a
        href={detailsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-br from-[#66AB8C] to-[#66AB8C]/80 text-white p-6 rounded-xl text-center hover:transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        <h4 className="text-lg font-semibold mb-2">Program Details</h4>
        <p className="text-sm opacity-90">Comprehensive curriculum overview</p>
      </a>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-[#66AB8C] to-[#66AB8C]/80 text-white p-6 rounded-xl text-center">
      <h4 className="text-lg font-semibold mb-2">Program Details</h4>
      <p className="text-sm opacity-90">Comprehensive curriculum overview</p>
    </div>
  );
};