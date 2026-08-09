import React from 'react';

export const PostSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl glass-card p-6 animate-pulse flex flex-col space-y-4">
      <div className="h-48 bg-slate-200/70 rounded-xl w-full"></div>
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-slate-200/70 rounded-full"></div>
        <div className="h-5 w-16 bg-slate-200/70 rounded-full"></div>
      </div>
      <div className="h-7 bg-slate-200/70 rounded-md w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200/70 rounded w-full"></div>
        <div className="h-4 bg-slate-200/70 rounded w-5/6"></div>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200"></div>
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
        </div>
        <div className="h-4 w-20 bg-slate-200 rounded"></div>
      </div>
    </div>
  );
};
