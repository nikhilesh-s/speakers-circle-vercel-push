import React, { useState } from 'react';
import { Menu, X, Users } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'information', label: 'Information' },
    { id: 'events', label: 'Events' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: '1on1', label: '1-on-1' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="https://i.imgur.com/Uqxojaz.png"
              alt="SpeakersCircle Logo"
              className="h-10 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <button
              onClick={() => onPageChange('home')}
              className="px-4 py-2 text-2xl font-black text-[#6EC4DB] hover:text-[#6EC4DB]/80 transition-colors duration-200 rounded-md"
            >
              Speakers Circle
            </button>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                  currentPage === item.id
                    ? 'text-white bg-[#FA7C92]'
                    : 'text-gray-700 hover:text-[#FA7C92] hover:bg-[#FA7C92]/5'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Login Button */}
            <button
              onClick={() => onPageChange('login')}
              className="bg-[#66AB8C] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#66AB8C]/90 transition-colors duration-200"
            >
              Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#FA7C92] p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  onPageChange('home');
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-2xl font-black text-[#6EC4DB] hover:text-[#6EC4DB]/80 transition-colors duration-200 rounded-md"
              >
                Speakers Circle
              </button>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                    currentPage === item.id
                      ? 'text-white bg-[#FA7C92]'
                      : 'text-gray-700 hover:text-[#FA7C92] hover:bg-[#FA7C92]/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  onPageChange('login');
                  setIsOpen(false);
                }}
                className="w-full text-left bg-[#66AB8C] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#66AB8C]/90 transition-colors duration-200"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};