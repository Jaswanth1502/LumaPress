import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

export const Forbidden: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="text-center space-y-6 glass-panel p-12 rounded-3xl border border-slate-200/80 shadow-xl max-w-lg w-full">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-5xl font-bold text-slate-900">403</h1>
          <h2 className="font-serif text-2xl font-semibold text-slate-800">Access Denied</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            You do not have permission to view or edit this resource. Please verify that you are logged into the correct author account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/login"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>Switch Account</span>
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
