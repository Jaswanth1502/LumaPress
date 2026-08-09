import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="text-center space-y-6 glass-panel p-12 rounded-3xl border border-slate-200/80 shadow-xl max-w-lg w-full">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
          <FileQuestion className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-5xl font-bold text-slate-900">404</h1>
          <h2 className="font-serif text-2xl font-semibold text-slate-800">Page Not Found</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            The page you are looking for might have been removed, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            <span>Explore Articles</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
