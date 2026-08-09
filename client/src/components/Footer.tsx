import React from 'react';
import { Link } from 'react-router-dom';
import { Feather, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/60 bg-white/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center border border-indigo-200/50">
                <Feather className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold text-slate-900">LumaPress</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              A high-craft editorial publishing engine designed for modern authors, developers, and thinkers. Built with React, Node.js, and MongoDB.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Explore Articles
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Author Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Profile Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LumaPress. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for full-stack engineering excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};
