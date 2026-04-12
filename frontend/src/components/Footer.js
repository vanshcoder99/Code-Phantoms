import React from 'react';
import { Mail, GitBranch, Linkedin } from 'lucide-react';

export default function Footer({ darkMode }) {
  return (
    <footer className={`${darkMode ? 'bg-quaternary text-gray-400' : 'bg-quaternary text-gray-400'} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4">About Investing Fear</h3>
            <p className="text-sm">
              We help young investors overcome fear through simulation, education, and AI guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#simulator" className="hover:text-white transition">Simulator</a></li>
              <li><a href="#explainer" className="hover:text-white transition">AI Explainer</a></li>
              <li><a href="#learning" className="hover:text-white transition">Learning</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Get in Touch</h3>
            <div className="flex gap-4">
              <a href="mailto:contact@investingfear.com" className="hover:text-white transition">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <GitBranch className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>Copyright 2024 Investing Fear. All rights reserved. Built for young investors</p>
        </div>
      </div>
    </footer>
  );
}
