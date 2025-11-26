import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

// Components
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { InformationPage } from './components/InformationPage';
import EventsPage from './components/EventsPage';
import TestimonialsPage from './components/TestimonialsPage';
import OneOnOnePage from './components/OneOnOnePage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { ContactForm } from './components/ContactForm';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'about':
        return <AboutPage />;
      case 'information':
        return <InformationPage onPageChange={setCurrentPage} />;
      case 'events':
        return <EventsPage />;
      case 'testimonials':
        return <TestimonialsPage />;
      case '1on1':
        return <OneOnOnePage />;
      case 'login':
        return <LoginPage onPageChange={setCurrentPage} />;
      case 'admin':
        return <AdminPage onPageChange={setCurrentPage} />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main>
        {renderPage()}
      </main>

      <Footer onPageChange={setCurrentPage} />

      {/* Floating Contact Button */}
      <button
        onClick={() => setIsContactFormOpen(true)}
        className="fixed bottom-6 right-6 bg-[#FA7C92] text-white p-4 rounded-full shadow-lg hover:bg-[#FA7C92]/90 transition-all duration-200 z-40 hover:scale-110"
        aria-label="Contact Us"
      >
        <MessageCircle size={24} />
      </button>

      {/* Contact Form Modal */}
      <ContactForm 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
    </div>
  );
}

export default App;