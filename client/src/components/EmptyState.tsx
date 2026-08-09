import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <FileQuestion className="w-10 h-10 text-slate-400" />,
  title,
  description,
  action,
}) => {
  return (
    <div className="rounded-2xl glass-panel p-12 text-center flex flex-col items-center justify-center border border-slate-200/80 my-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50/80 text-indigo-600 flex items-center justify-center mb-4 shadow-xs">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-md leading-relaxed mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-xs"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
