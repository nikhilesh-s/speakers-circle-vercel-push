import React from 'react';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import { useEditableContent } from '../hooks/useSupabase';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPageChange }) => {
  const instagramLink = useEditableContent('instagram_link');
  const facebookLink = useEditableContent('facebook_link');
  const youtubeLink = useEditableContent('youtube_link');

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a
                href={instagramLink || "https://www.instagram.com/gallantgaveliers"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FA7C92] transition-colors duration-200"
              >
                <Instagram size={24} />
              </a>
              <a
                href={facebookLink || "https://www.facebook.com/profile.php?id=100022753525879"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#6EC4DB] transition-colors duration-200"
              >
                <Facebook size={24} />
              </a>
              {(youtubeLink || youtubeLink === '') && (
                <a
                  href={youtubeLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <Youtube size={24} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button
                onClick={() => onPageChange('home')}
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => onPageChange('about')}
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                About
              </button>
              <button
                onClick={() => onPageChange('events')}
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Events
              </button>
              <button
                onClick={() => onPageChange('admin')}
                className="block text-gray-400 hover:text-white transition-colors duration-200"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <button className="block text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </button>
              <button className="block text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Use
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2025 Speakers Circle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};