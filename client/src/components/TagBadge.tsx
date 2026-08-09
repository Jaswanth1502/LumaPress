import React from 'react';

interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  selected?: boolean;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, onClick, selected }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${
        selected
          ? 'bg-[#0d5c3a] text-white shadow-xs'
          : 'bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200/60'
      } ${onClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
    >
      #{tag}
    </button>
  );
};
